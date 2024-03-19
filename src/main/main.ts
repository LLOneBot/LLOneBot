// 运行在 Electron 主进程 下的插件入口

import {BrowserWindow, dialog, ipcMain} from 'electron';
import * as fs from 'node:fs';
import {Config} from "../common/types";
import {
    CHANNEL_ERROR,
    CHANNEL_GET_CONFIG,
    CHANNEL_LOG,
    CHANNEL_CHECKVERSION,
    CHANNEL_SELECT_FILE,
    CHANNEL_SET_CONFIG,
    CHANNEL_UPDATE,
} from "../common/channels";
import {ob11WebsocketServer} from "../onebot11/server/ws/WebsocketServer";
import {DATA_DIR} from "../common/utils";
import {
    friendRequests,
    getFriend,
    getGroup,
    getGroupMember,
    llonebotError,
    refreshGroupMembers,
    selfInfo, uidMaps
} from "../common/data";
import {hookNTQQApiCall, hookNTQQApiReceive, ReceiveCmdS, registerReceiveHook} from "../ntqqapi/hook";
import {OB11Constructor} from "../onebot11/constructor";
import {ChatType, FriendRequestNotify, GroupNotifies, GroupNotifyTypes, RawMessage} from "../ntqqapi/types";
import {ob11HTTPServer} from "../onebot11/server/http";
import {OB11FriendRecallNoticeEvent} from "../onebot11/event/notice/OB11FriendRecallNoticeEvent";
import {OB11GroupRecallNoticeEvent} from "../onebot11/event/notice/OB11GroupRecallNoticeEvent";
import {postOB11Event} from "../onebot11/server/postOB11Event";
import {ob11ReverseWebsockets} from "../onebot11/server/ws/ReverseWebsocket";
import {OB11GroupAdminNoticeEvent} from "../onebot11/event/notice/OB11GroupAdminNoticeEvent";
import {OB11GroupRequestEvent} from "../onebot11/event/request/OB11GroupRequest";
import {OB11FriendRequestEvent} from "../onebot11/event/request/OB11FriendRequest";
import * as path from "node:path";
import {dbUtil} from "../common/db";
import {setConfig} from "./setConfig";
import {NTQQUserApi} from "../ntqqapi/api/user";
import {NTQQGroupApi} from "../ntqqapi/api/group";
import {registerPokeHandler} from "../ntqqapi/external/ccpoke";
import {OB11FriendPokeEvent, OB11GroupPokeEvent} from "../onebot11/event/notice/OB11PokeEvent";
import {checkVersion, updateLLOneBot} from "../common/utils/update";
import {checkFfmpeg} from "../common/utils/file";
import {log} from "../common/utils/log";
import {getConfigUtil} from "../common/config";


let running = false;


// 加载插件时触发
function onLoad() {
    log("llonebot main onLoad");
    ipcMain.handle(CHANNEL_CHECKVERSION, async (event, arg) => {
        return checkVersion();
    });
    ipcMain.handle(CHANNEL_UPDATE, async (event, arg) => {
        return updateLLOneBot();
    });
    ipcMain.handle(CHANNEL_SELECT_FILE, async (event, arg) => {
        const selectPath = new Promise<string>((resolve, reject) => {
            dialog
                .showOpenDialog({
                    title: "请选择ffmpeg",
                    properties: ["openFile"],
                    buttonLabel: "确定",
                })
                .then((result) => {
                    log("选择文件", result);
                    if (!result.canceled) {
                        const _selectPath = path.join(result.filePaths[0]);
                        resolve(_selectPath);
                        // let config = getConfigUtil().getConfig()
                        // config.ffmpeg = path.join(result.filePaths[0]);
                        // getConfigUtil().setConfig(config);
                    }
                    resolve("")
                })
                .catch((err) => {
                    reject(err);
                });
        })
        try {
            return await selectPath;
        } catch (e) {
            log("选择文件出错", e)
            return ""
        }
    })
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, {recursive: true});
    }
    ipcMain.handle(CHANNEL_ERROR, (event, arg) => {
        return llonebotError;
    })
    ipcMain.handle(CHANNEL_GET_CONFIG, async (event, arg) => {
        const config = getConfigUtil().getConfig()
        return config;
    })
    ipcMain.on(CHANNEL_SET_CONFIG, (event, config: Config) => {
        setConfig(config).then();
    })

    ipcMain.on(CHANNEL_LOG, (event, arg) => {
        log(arg);
    })

    async function postReceiveMsg(msgList: RawMessage[]) {
        const {debug, reportSelfMessage} = getConfigUtil().getConfig();
        for (let message of msgList) {

            // log("收到新消息", message.msgId, message.msgSeq)
            // if (message.senderUin !== selfInfo.uin){
            message.msgShortId = await dbUtil.addMsg(message);
            // }

            OB11Constructor.message(message).then((msg) => {
                if (debug) {
                    msg.raw = message;
                } else {
                    if (msg.message.length === 0) {
                        return
                    }
                }
                const isSelfMsg = msg.user_id.toString() == selfInfo.uin
                if (isSelfMsg && !reportSelfMessage) {
                    return
                }
                if (isSelfMsg) {
                    msg.target_id = parseInt(message.peerUin);
                }
                postOB11Event(msg);
                // log("post msg", msg)
            }).catch(e => log("constructMessage error: ", e.stack.toString()));
            OB11Constructor.GroupEvent(message).then(groupEvent => {
                if (groupEvent) {
                    // log("post group event", groupEvent);
                    postOB11Event(groupEvent);
                }
            })
        }
    }

    async function startReceiveHook() {
        if (getConfigUtil().getConfig().enablePoke) {
            registerPokeHandler((id, isGroup) => {
                log(`收到戳一戳消息了！是否群聊：${isGroup}，id:${id}`)
                let pokeEvent: OB11FriendPokeEvent | OB11GroupPokeEvent;
                if (isGroup) {
                    pokeEvent = new OB11GroupPokeEvent(parseInt(id));
                } else {
                    pokeEvent = new OB11FriendPokeEvent(parseInt(id));
                }
                postOB11Event(pokeEvent);
            })
        }
        registerReceiveHook<{
            msgList: Array<RawMessage>
        }>([ReceiveCmdS.NEW_MSG, ReceiveCmdS.NEW_ACTIVE_MSG], async (payload) => {
            try {
                await postReceiveMsg(payload.msgList);
            } catch (e) {
                log("report message error: ", e.stack.toString());
            }
        })
        registerReceiveHook<{ msgList: Array<RawMessage> }>([ReceiveCmdS.UPDATE_MSG], async (payload) => {
            for (const message of payload.msgList) {
                // log("message update", message.sendStatus, message.msgId, message.msgSeq)
                if (message.recallTime != "0") { //todo: 这个判断方法不太好，应该使用灰色消息元素来判断
                    // 撤回消息上报
                    const oriMessage = await dbUtil.getMsgByLongId(message.msgId)
                    if (!oriMessage) {
                        continue
                    }
                    oriMessage.recallTime = message.recallTime
                    dbUtil.updateMsg(oriMessage).then();
                    if (message.chatType == ChatType.friend) {
                        const friendRecallEvent = new OB11FriendRecallNoticeEvent(parseInt(message.senderUin), oriMessage.msgShortId);
                        postOB11Event(friendRecallEvent);
                    } else if (message.chatType == ChatType.group) {
                        let operatorId = message.senderUin
                        for (const element of message.elements) {
                            const operatorUid = element.grayTipElement?.revokeElement.operatorUid
                            const operator = await getGroupMember(message.peerUin, operatorUid)
                            operatorId = operator.uin
                        }
                        const groupRecallEvent = new OB11GroupRecallNoticeEvent(
                            parseInt(message.peerUin),
                            parseInt(message.senderUin),
                            parseInt(operatorId),
                            oriMessage.msgShortId
                        )

                        postOB11Event(groupRecallEvent);
                    }
                    // 不让入库覆盖原来消息，不然就获取不到撤回的消息内容了
                    continue
                }
                dbUtil.updateMsg(message).then();
            }
        })
        registerReceiveHook<{ msgRecord: RawMessage }>(ReceiveCmdS.SELF_SEND_MSG, async (payload) => {
            const {reportSelfMessage} = getConfigUtil().getConfig();
            if (!reportSelfMessage) {
                return
            }
            // log("reportSelfMessage", payload)
            try {
                await postReceiveMsg([payload.msgRecord]);
            } catch (e) {
                log("report self message error: ", e.stack.toString());
            }
        })
        registerReceiveHook<{
            "doubt": boolean,
            "oldestUnreadSeq": string,
            "unreadCount": number
        }>(ReceiveCmdS.UNREAD_GROUP_NOTIFY, async (payload) => {
            if (payload.unreadCount) {
                // log("开始获取群通知详情")
                let notify: GroupNotifies;
                try {
                    notify = await NTQQGroupApi.getGroupNotifies();
                } catch (e) {
                    // log("获取群通知详情失败", e);
                    return
                }

                const notifies = notify.notifies.slice(0, payload.unreadCount)
                // log("获取群通知详情完成", notifies, payload);

                for (const notify of notifies) {
                    try {
                        notify.time = Date.now();
                        // const notifyTime = parseInt(notify.seq) / 1000
                        // log(`加群通知时间${notifyTime}`, `LLOneBot启动时间${startTime}`);
                        // if (notifyTime < startTime) {
                        //     continue;
                        // }
                        let existNotify = await dbUtil.getGroupNotify(notify.seq);
                        if (existNotify) {
                            continue
                        }
                        log("收到群通知", notify);
                        await dbUtil.addGroupNotify(notify);
                        // let member2: GroupMember;
                        // if (notify.user2.uid) {
                        //     member2 = await getGroupMember(notify.group.groupCode, null, notify.user2.uid);
                        // }
                        if ([GroupNotifyTypes.ADMIN_SET, GroupNotifyTypes.ADMIN_UNSET].includes(notify.type)) {
                            const member1 = await getGroupMember(notify.group.groupCode, notify.user1.uid);
                            log("有管理员变动通知");
                            refreshGroupMembers(notify.group.groupCode).then()
                            let groupAdminNoticeEvent = new OB11GroupAdminNoticeEvent()
                            groupAdminNoticeEvent.group_id = parseInt(notify.group.groupCode);
                            log("开始获取变动的管理员")
                            if (member1) {
                                log("变动管理员获取成功")
                                groupAdminNoticeEvent.user_id = parseInt(member1.uin);
                                groupAdminNoticeEvent.sub_type = notify.type == GroupNotifyTypes.ADMIN_UNSET ? "unset" : "set";
                                postOB11Event(groupAdminNoticeEvent, true);
                            } else {
                                log("获取群通知的成员信息失败", notify, getGroup(notify.group.groupCode));
                            }
                        } else if (notify.type == GroupNotifyTypes.MEMBER_EXIT) {
                            // log("有成员退出通知");
                            // const member1 = await getGroupMember(notify.group.groupCode, null, notify.user1.uid);
                            // let groupDecreaseEvent = new OB11GroupDecreaseEvent(parseInt(notify.group.groupCode), parseInt(member1.uin))
                            // postEvent(groupDecreaseEvent, true);
                        } else if ([GroupNotifyTypes.JOIN_REQUEST].includes(notify.type)) {
                            log("有加群请求");
                            let groupRequestEvent = new OB11GroupRequestEvent();
                            groupRequestEvent.group_id = parseInt(notify.group.groupCode);
                            let requestQQ = ""
                            try {
                                requestQQ = (await NTQQUserApi.getUserDetailInfo(notify.user1.uid)).uin;
                            } catch (e) {
                                log("获取加群人QQ号失败", e)
                            }
                            groupRequestEvent.user_id = parseInt(requestQQ) || 0;
                            groupRequestEvent.sub_type = "add"
                            groupRequestEvent.comment = notify.postscript;
                            groupRequestEvent.flag = notify.seq;
                            postOB11Event(groupRequestEvent);
                        } else if (notify.type == GroupNotifyTypes.INVITE_ME) {
                            log("收到邀请我加群通知")
                            let groupInviteEvent = new OB11GroupRequestEvent();
                            groupInviteEvent.group_id = parseInt(notify.group.groupCode);
                            let user_id = (await getFriend(notify.user2.uid))?.uin
                            if (!user_id) {
                                user_id = (await NTQQUserApi.getUserDetailInfo(notify.user2.uid))?.uin
                            }
                            groupInviteEvent.user_id = parseInt(user_id);
                            groupInviteEvent.sub_type = "invite";
                            groupInviteEvent.flag = notify.seq;
                            postOB11Event(groupInviteEvent);
                        }
                    } catch (e) {
                        log("解析群通知失败", e.stack.toString());
                    }
                }

            } else if (payload.doubt) {
                // 可能有群管理员变动
            }
        })

        registerReceiveHook<FriendRequestNotify>(ReceiveCmdS.FRIEND_REQUEST, async (payload) => {
            for (const req of payload.data.buddyReqs) {
                if (req.isUnread && !friendRequests[req.sourceId] && (parseInt(req.reqTime) > startTime / 1000)) {
                    friendRequests[req.sourceId] = req;
                    log("有新的好友请求", req);
                    let friendRequestEvent = new OB11FriendRequestEvent();
                    try {
                        let requester = await NTQQUserApi.getUserDetailInfo(req.friendUid)
                        friendRequestEvent.user_id = parseInt(requester.uin);
                    } catch (e) {
                        log("获取加好友者QQ号失败", e);
                    }
                    friendRequestEvent.flag = req.sourceId.toString();
                    friendRequestEvent.comment = req.extWords;
                    postOB11Event(friendRequestEvent);
                }
            }
        })
    }

    let startTime = 0;

    async function start() {
        log("llonebot pid", process.pid)

        startTime = Date.now();
        dbUtil.getReceivedTempUinMap().then(m=>{
            for (const [key, value] of Object.entries(m)) {
                uidMaps[value] = key;
            }
        })
        startReceiveHook().then();
        NTQQGroupApi.getGroups(true).then()
        const config = getConfigUtil().getConfig()
        // 检查ffmpeg
        checkFfmpeg(config.ffmpeg).then(exist => {
            if (!exist) {
                llonebotError.ffmpegError = `没有找到ffmpeg,音频只能发送wav和silk`
            }
        })
        if (config.ob11.enableHttp) {
            try {
                ob11HTTPServer.start(config.ob11.httpPort)
            } catch (e) {
                log("http server start failed", e);
            }
        }
        if (config.ob11.enableWs) {
            ob11WebsocketServer.start(config.ob11.wsPort);
        }
        if (config.ob11.enableWsReverse) {
            ob11ReverseWebsockets.start();
        }

        log("LLOneBot start")
    }

    let getSelfNickCount = 0;
    const init = async () => {
        try {
            log("start get self info")
            const _ = await NTQQUserApi.getSelfInfo();
            log("get self info api result:", _);
            Object.assign(selfInfo, _);
            selfInfo.nick = selfInfo.uin;
        } catch (e) {
            log("retry get self info", e);
        }
        log("self info", selfInfo);
        if (selfInfo.uin) {
            try {
                const userInfo = (await NTQQUserApi.getUserDetailInfo(selfInfo.uid));
                log("self info", userInfo);
                if (userInfo) {
                    selfInfo.nick = userInfo.nick;
                } else {
                    getSelfNickCount++;
                    if (getSelfNickCount < 10) {
                        return setTimeout(init, 1000);
                    }
                }
            } catch (e) {
                log("get self nickname failed", e.toString());
                return setTimeout(init, 1000);
            }
            start().then();
        } else {
            setTimeout(init, 1000)
        }
    }
    setTimeout(init, 1000);
}


// 创建窗口时触发
function onBrowserWindowCreated(window: BrowserWindow) {
    if (selfInfo.uid) {
        return
    }
    log("window create", window.webContents.getURL().toString())
    try {
        hookNTQQApiCall(window);
        hookNTQQApiReceive(window);
    } catch (e) {
        log("LLOneBot hook error: ", e.toString())
    }
}

try {
    onLoad();
} catch (e: any) {
    console.log(e.toString())
}

// 这两个函数都是可选的
export {
    onBrowserWindowCreated
}