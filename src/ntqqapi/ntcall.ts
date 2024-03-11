import {ipcMain} from "electron";
import {hookApiCallbacks, ReceiveCmd, registerReceiveHook, removeReceiveHook} from "./hook";
import {log, sleep} from "../common/utils";
import {
    ChatType,
    ElementType,
    Friend,
    FriendRequest,
    Group,
    GroupMember,
    GroupMemberRole,
    GroupNotifies,
    GroupNotify,
    GroupRequestOperateTypes,
    RawMessage,
    SelfInfo,
    SendMessageElement,
    User,
    CacheScanResult,
    ChatCacheList, ChatCacheListItemBasic,
    CacheFileList, CacheFileListItem, CacheFileType,
} from "./types";
import * as fs from "fs";
import {friendRequests, selfInfo, uidMaps} from "../common/data";
import {v4 as uuidv4} from "uuid"
import path from "path";
import {dbUtil} from "../common/db";

interface IPCReceiveEvent {
    eventName: string
    callbackId: string
}

export type IPCReceiveDetail = [
    {
        cmdName: NTQQApiMethod
        payload: unknown
    },
]

export enum NTQQApiClass {
    NT_API = "ns-ntApi",
    FS_API = "ns-FsApi",
    OS_API = "ns-OsApi",
    HOTUPDATE_API = "ns-HotUpdateApi",
    BUSINESS_API = "ns-BusinessApi",
    GLOBAL_DATA = "ns-GlobalDataApi"
}

export enum NTQQApiMethod {
    LIKE_FRIEND = "nodeIKernelProfileLikeService/setBuddyProfileLike",
    SELF_INFO = "fetchAuthData",
    FRIENDS = "nodeIKernelBuddyService/getBuddyList",
    GROUPS = "nodeIKernelGroupService/getGroupList",
    GROUP_MEMBER_SCENE = "nodeIKernelGroupService/createMemberListScene",
    GROUP_MEMBERS = "nodeIKernelGroupService/getNextMemberList",
    USER_INFO = "nodeIKernelProfileService/getUserSimpleInfo",
    USER_DETAIL_INFO = "nodeIKernelProfileService/getUserDetailInfo",
    FILE_TYPE = "getFileType",
    FILE_MD5 = "getFileMd5",
    FILE_COPY = "copyFile",
    IMAGE_SIZE = "getImageSizeFromPath",
    FILE_SIZE = "getFileSize",
    MEDIA_FILE_PATH = "nodeIKernelMsgService/getRichMediaFilePathForGuild",
    RECALL_MSG = "nodeIKernelMsgService/recallMsg",
    SEND_MSG = "nodeIKernelMsgService/sendMsg",
    DOWNLOAD_MEDIA = "nodeIKernelMsgService/downloadRichMedia",
    FORWARD_MSG = "nodeIKernelMsgService/forwardMsgWithComment",
    MULTI_FORWARD_MSG = "nodeIKernelMsgService/multiForwardMsgWithComment", // 合并转发
    GET_GROUP_NOTICE = "nodeIKernelGroupService/getSingleScreenNotifies",
    HANDLE_GROUP_REQUEST = "nodeIKernelGroupService/operateSysNotify",
    QUIT_GROUP = "nodeIKernelGroupService/quitGroup",
    // READ_FRIEND_REQUEST = "nodeIKernelBuddyListener/onDoubtBuddyReqUnreadNumChange"
    HANDLE_FRIEND_REQUEST = "nodeIKernelBuddyService/approvalFriendRequest",
    KICK_MEMBER = "nodeIKernelGroupService/kickMember",
    MUTE_MEMBER = "nodeIKernelGroupService/setMemberShutUp",
    MUTE_GROUP = "nodeIKernelGroupService/setGroupShutUp",
    SET_MEMBER_CARD = "nodeIKernelGroupService/modifyMemberCardName",
    SET_MEMBER_ROLE = "nodeIKernelGroupService/modifyMemberRole",
    PUBLISH_GROUP_BULLETIN = "nodeIKernelGroupService/publishGroupBulletinBulletin",
    SET_GROUP_NAME = "nodeIKernelGroupService/modifyGroupName",

    CACHE_SET_SILENCE = 'nodeIKernelStorageCleanService/setSilentScan',
    CACHE_ADD_SCANNED_PATH = 'nodeIKernelStorageCleanService/addCacheScanedPaths',
    CACHE_PATH_HOT_UPDATE = 'getHotUpdateCachePath',
    CACHE_PATH_DESKTOP_TEMP = 'getDesktopTmpPath',
    CACHE_PATH_SESSION = 'getCleanableAppSessionPathList',
    CACHE_SCAN = 'nodeIKernelStorageCleanService/scanCache',
    CACHE_CLEAR = 'nodeIKernelStorageCleanService/clearCacheDataByKeys',

    CACHE_CHAT_GET = 'nodeIKernelStorageCleanService/getChatCacheInfo',
    CACHE_FILE_GET = 'nodeIKernelStorageCleanService/getFileCacheInfo',
    CACHE_CHAT_CLEAR = 'nodeIKernelStorageCleanService/clearChatCacheInfo',
}

enum NTQQApiChannel {
    IPC_UP_2 = "IPC_UP_2",
    IPC_UP_3 = "IPC_UP_3",
    IPC_UP_1 = "IPC_UP_1",
}

export interface Peer {
    chatType: ChatType
    peerUid: string  // 如果是群聊uid为群号，私聊uid就是加密的字符串
    guildId?: ""
}

interface NTQQApiParams {
    methodName: NTQQApiMethod | string,
    className?: NTQQApiClass,
    channel?: NTQQApiChannel,
    classNameIsRegister?: boolean
    args?: unknown[],
    cbCmd?: ReceiveCmd | null,
    cmdCB?: (payload: any) => boolean;
    afterFirstCmd?: boolean,  // 是否在methodName调用完之后再去hook cbCmd
    timeoutSecond?: number,
}

function callNTQQApi<ReturnType>(params: NTQQApiParams) {
    let {
        className, methodName, channel, args,
        cbCmd, timeoutSecond: timeout,
        classNameIsRegister, cmdCB, afterFirstCmd
    } = params;
    className = className ?? NTQQApiClass.NT_API;
    channel = channel ?? NTQQApiChannel.IPC_UP_2;
    args = args ?? [];
    timeout = timeout ?? 5;
    afterFirstCmd = afterFirstCmd ?? true;
    const uuid = uuidv4();
    // log("callNTQQApi", channel, className, methodName, args, uuid)
    return new Promise((resolve: (data: ReturnType) => void, reject) => {
        // log("callNTQQApiPromise", channel, className, methodName, args, uuid)
        const _timeout = timeout * 1000
        let success = false
        let eventName = className + "-" + channel[channel.length - 1];
        if (classNameIsRegister) {
            eventName += "-register";
        }
        const apiArgs = [methodName, ...args]
        if (!cbCmd) {
            // QQ后端会返回结果，并且可以插根据uuid识别
            hookApiCallbacks[uuid] = (r: ReturnType) => {
                success = true
                resolve(r)
            };
        } else {
            // 这里的callback比较特殊，QQ后端先返回是否调用成功，再返回一条结果数据
            const secondCallback = () => {
                const hookId = registerReceiveHook<ReturnType>(cbCmd, (payload) => {
                    // log(methodName, "second callback", cbCmd, payload, cmdCB);
                    if (!!cmdCB) {
                        if (cmdCB(payload)) {
                            removeReceiveHook(hookId);
                            success = true
                            resolve(payload);
                        }
                    } else {
                        removeReceiveHook(hookId);
                        success = true
                        resolve(payload);
                    }
                })
            }
            !afterFirstCmd && secondCallback();
            hookApiCallbacks[uuid] = (result: GeneralCallResult) => {
                log(`${methodName} callback`, result)
                if (result?.result == 0 || result === undefined) {
                    afterFirstCmd && secondCallback();
                } else {
                    success = true
                    reject(`ntqq api call failed, ${result.errMsg}`);
                }
            }
        }
        setTimeout(() => {
            // log("ntqq api timeout", success, channel, className, methodName)
            if (!success) {
                log(`ntqq api timeout ${channel}, ${eventName}, ${methodName}`, apiArgs);
                reject(`ntqq api timeout ${channel}, ${eventName}, ${methodName}, ${apiArgs}`)
            }
        }, _timeout)

        ipcMain.emit(
            channel,
            {},
            {type: 'request', callbackId: uuid, eventName},
            apiArgs
        )
    })
}


export let sendMessagePool: Record<string, ((sendSuccessMsg: RawMessage) => void) | null> = {}// peerUid: callbackFunnc

interface GeneralCallResult {
    result: number,  // 0: success
    errMsg: string
}


export class NTQQApi {
    // static likeFriend = defineNTQQApi<void>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.LIKE_FRIEND)
    static async likeFriend(uid: string, count = 1) {
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.LIKE_FRIEND,
            args: [{
                doLikeUserInfo: {
                    friendUid: uid,
                    sourceId: 71,
                    doLikeCount: count,
                    doLikeTollCount: 0
                }
            }, null]
        })
    }

    static async getSelfInfo() {
        return await callNTQQApi<SelfInfo>({
            className: NTQQApiClass.GLOBAL_DATA,
            methodName: NTQQApiMethod.SELF_INFO, timeoutSecond: 2
        })
    }

    static async getUserInfo(uid: string) {
        const result = await callNTQQApi<{ profiles: Map<string, User> }>({
            methodName: NTQQApiMethod.USER_INFO,
            args: [{force: true, uids: [uid]}, undefined],
            cbCmd: ReceiveCmd.USER_INFO
        })
        return result.profiles.get(uid)
    }

    static async getUserDetailInfo(uid: string) {
        const result = await callNTQQApi<{ info: User }>({
            methodName: NTQQApiMethod.USER_DETAIL_INFO,
            cbCmd: ReceiveCmd.USER_DETAIL_INFO,
            afterFirstCmd: false,
            cmdCB: (payload) => {
                const success = payload.info.uid == uid
                // log("get user detail info", success, uid, payload)
                return success
            },
            args: [
                {
                    uid
                },
                null
            ]
        })
        return result.info
    }

    static async getFriends(forced = false) {
        const data = await callNTQQApi<{
            data: {
                categoryId: number,
                categroyName: string,
                categroyMbCount: number,
                buddyList: Friend[]
            }[]
        }>(
            {
                methodName: NTQQApiMethod.FRIENDS,
                args: [{force_update: forced}, undefined],
                cbCmd: ReceiveCmd.FRIENDS
            })
        let _friends: Friend[] = [];
        for (const fData of data.data) {
            _friends.push(...fData.buddyList)
        }
        return _friends
    }

    static async getGroups(forced = false) {
        let cbCmd = ReceiveCmd.GROUPS
        if (process.platform != "win32") {
            cbCmd = ReceiveCmd.GROUPS_UNIX
        }
        const result = await callNTQQApi<{
            updateType: number,
            groupList: Group[]
        }>({methodName: NTQQApiMethod.GROUPS, args: [{force_update: forced}, undefined], cbCmd})
        return result.groupList
    }

    static async getGroupMembers(groupQQ: string, num = 3000): Promise<GroupMember[]> {
        const sceneId = await callNTQQApi({
            methodName: NTQQApiMethod.GROUP_MEMBER_SCENE,
            args: [{
                groupCode: groupQQ,
                scene: "groupMemberList_MainWindow"
            }]
        })
        // log("get group member sceneId", sceneId);
        try {
            const result = await callNTQQApi<{
                result: { infos: any }
            }>({
                methodName: NTQQApiMethod.GROUP_MEMBERS,
                args: [{
                    sceneId: sceneId,
                    num: num
                },
                    null
                ]
            })
            // log("members info", typeof result.result.infos, Object.keys(result.result.infos))
            const values = result.result.infos.values()

            const members: GroupMember[] = Array.from(values)
            for (const member of members) {
                uidMaps[member.uid] = member.uin;
            }
            // log(uidMaps);
            // log("members info", values);
            log(`get group ${groupQQ} members success`)
            return members
        } catch (e) {
            log(`get group ${groupQQ} members failed`, e)
            return []
        }
    }

    static async getFileType(filePath: string) {
        return await callNTQQApi<{ ext: string }>({
            className: NTQQApiClass.FS_API, methodName: NTQQApiMethod.FILE_TYPE, args: [filePath]
        })
    }

    static async getFileMd5(filePath: string) {
        return await callNTQQApi<string>({
            className: NTQQApiClass.FS_API,
            methodName: NTQQApiMethod.FILE_MD5,
            args: [filePath]
        })
    }

    static async copyFile(filePath: string, destPath: string) {
        return await callNTQQApi<string>({
            className: NTQQApiClass.FS_API,
            methodName: NTQQApiMethod.FILE_COPY,
            args: [{
                fromPath: filePath,
                toPath: destPath
            }]
        })
    }

    static async getImageSize(filePath: string) {
        return await callNTQQApi<{ width: number, height: number }>({
            className: NTQQApiClass.FS_API, methodName: NTQQApiMethod.IMAGE_SIZE, args: [filePath]
        })
    }

    static async getFileSize(filePath: string) {
        return await callNTQQApi<number>({
            className: NTQQApiClass.FS_API, methodName: NTQQApiMethod.FILE_SIZE, args: [filePath]
        })
    }

    // 上传文件到QQ的文件夹
    static async uploadFile(filePath: string, elementType: ElementType = ElementType.PIC) {
        const md5 = await NTQQApi.getFileMd5(filePath);
        let ext = (await NTQQApi.getFileType(filePath))?.ext
        if (ext) {
            ext = "." + ext
        } else {
            ext = ""
        }
        let fileName = `${path.basename(filePath)}`;
        if (fileName.indexOf(".") === -1) {
            fileName += ext;
        }
        const mediaPath = await callNTQQApi<string>({
            methodName: NTQQApiMethod.MEDIA_FILE_PATH,
            args: [{
                path_info: {
                    md5HexStr: md5,
                    fileName: fileName,
                    elementType: elementType,
                    elementSubType: 0,
                    thumbSize: 0,
                    needCreate: true,
                    downloadType: 1,
                    file_uuid: ""
                }
            }]
        })
        log("media path", mediaPath)
        await NTQQApi.copyFile(filePath, mediaPath);
        const fileSize = await NTQQApi.getFileSize(filePath);
        return {
            md5,
            fileName,
            path: mediaPath,
            fileSize
        }
    }

    static async downloadMedia(msgId: string, chatType: ChatType, peerUid: string, elementId: string, thumbPath: string, sourcePath: string) {
        // 用于下载收到的消息中的图片等
        if (fs.existsSync(sourcePath)) {
            return sourcePath
        }
        const apiParams = [
            {
                getReq: {
                    msgId: msgId,
                    chatType: chatType,
                    peerUid: peerUid,
                    elementId: elementId,
                    thumbSize: 0,
                    downloadType: 1,
                    filePath: thumbPath,
                },
            },
            undefined,
        ]
        // log("需要下载media", sourcePath);
        await callNTQQApi({
            methodName: NTQQApiMethod.DOWNLOAD_MEDIA,
            args: apiParams,
            cbCmd: ReceiveCmd.MEDIA_DOWNLOAD_COMPLETE,
            cmdCB: (payload: { notifyInfo: { filePath: string } }) => {
                // log("media 下载完成判断", payload.notifyInfo.filePath, sourcePath);
                return payload.notifyInfo.filePath == sourcePath;
            }
        })
        return sourcePath
    }

    static async recallMsg(peer: Peer, msgIds: string[]) {
        return await callNTQQApi({
            methodName: NTQQApiMethod.RECALL_MSG,
            args: [{
                peer,
                msgIds
            }, null]
        })
    }

    static async sendMsg(peer: Peer, msgElements: SendMessageElement[], waitComplete = true, timeout = 10000) {
        const peerUid = peer.peerUid

        // 等待上一个相同的peer发送完
        let checkLastSendUsingTime = 0;
        const waitLastSend = async () => {
            if (checkLastSendUsingTime > timeout) {
                throw ("发送超时")
            }
            let lastSending = sendMessagePool[peer.peerUid]
            if (lastSending) {
                // log("有正在发送的消息，等待中...")
                await sleep(500);
                checkLastSendUsingTime += 500;
                return await waitLastSend();
            } else {
                return;
            }
        }
        await waitLastSend();

        let sentMessage: RawMessage = null;
        sendMessagePool[peerUid] = async (rawMessage: RawMessage) => {
            delete sendMessagePool[peerUid];
            sentMessage = rawMessage;
        }

        let checkSendCompleteUsingTime = 0;
        const checkSendComplete = async (): Promise<RawMessage> => {
            if (sentMessage) {
                if (waitComplete) {
                    if ((await dbUtil.getMsgByLongId(sentMessage.msgId)).sendStatus == 2) {
                        return sentMessage
                    }
                }
                else{
                    return sentMessage
                }
                // log(`给${peerUid}发送消息成功`)
            }
            checkSendCompleteUsingTime += 500
            if (checkSendCompleteUsingTime > timeout) {
                throw ('发送超时')
            }
            await sleep(500)
            return await checkSendComplete()
        }

        callNTQQApi({
            methodName: NTQQApiMethod.SEND_MSG,
            args: [{
                msgId: "0",
                peer, msgElements,
                msgAttributeInfos: new Map(),
            }, null]
        }).then()
        return await checkSendComplete()
    }

    static async forwardMsg(srcPeer: Peer, destPeer: Peer, msgIds: string[]) {
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.FORWARD_MSG,
            args:[
                {
                    msgIds: msgIds,
                    srcContact: srcPeer,
                    dstContacts: [
                        destPeer
                    ],
                    commentElements: [],
                    msgAttributeInfos: new Map()
                },
                null,
            ]
        })

    }
    static async multiForwardMsg(srcPeer: Peer, destPeer: Peer, msgIds: string[]) {
        const msgInfos = msgIds.map(id => {
            return {msgId: id, senderShowName: selfInfo.nick}
        })
        const apiArgs = [
            {
                msgInfos,
                srcContact: srcPeer,
                dstContact: destPeer,
                commentElements: [],
                msgAttributeInfos: new Map()
            },
            null,
        ]
        return await new Promise<RawMessage>((resolve, reject) => {
            let complete = false
            setTimeout(() => {
                if (!complete) {
                    reject("转发消息超时");
                }
            }, 5000)
            registerReceiveHook(ReceiveCmd.SELF_SEND_MSG, async (payload: { msgRecord: RawMessage }) => {
                const msg = payload.msgRecord
                // 需要判断它是转发的消息，并且识别到是当前转发的这一条
                const arkElement = msg.elements.find(ele => ele.arkElement)
                if (!arkElement) {
                    // log("收到的不是转发消息")
                    return
                }
                const forwardData: any = JSON.parse(arkElement.arkElement.bytesData)
                if (forwardData.app != 'com.tencent.multimsg') {
                    return
                }
                if (msg.peerUid == destPeer.peerUid && msg.senderUid == selfInfo.uid) {
                    complete = true
                    await dbUtil.addMsg(msg)
                    resolve(msg)
                    log('转发消息成功：', payload)
                }
            })
            callNTQQApi<GeneralCallResult>({
                methodName: NTQQApiMethod.MULTI_FORWARD_MSG,
                args: apiArgs
            }).then(result => {
                log("转发消息结果:", result, apiArgs)
                if (result.result !== 0) {
                    complete = true;
                    reject("转发消息失败," + JSON.stringify(result));
                }
            })
        })
    }

    static async getGroupNotifies() {
        // 获取管理员变更
        // 加群通知，退出通知，需要管理员权限
        callNTQQApi<GeneralCallResult>({
            methodName: ReceiveCmd.GROUP_NOTIFY,
            classNameIsRegister: true,
        }).then()
        return await callNTQQApi<GroupNotifies>({
            methodName: NTQQApiMethod.GET_GROUP_NOTICE,
            cbCmd: ReceiveCmd.GROUP_NOTIFY,
            afterFirstCmd: false,
            args: [
                {"doubt": false, "startSeq": "", "number": 14},
                null
            ]
        });
    }

    static async handleGroupRequest(seq: string, operateType: GroupRequestOperateTypes, reason?: string) {
        const notify: GroupNotify = await dbUtil.getGroupNotify(seq)
        if (!notify) {
            throw `${seq}对应的加群通知不存在`
        }
        // delete groupNotifies[seq];
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.HANDLE_GROUP_REQUEST,
            args: [
                {
                    "doubt": false,
                    "operateMsg": {
                        "operateType": operateType, // 2 拒绝
                        "targetMsg": {
                            "seq": seq,  // 通知序列号
                            "type": notify.type,
                            "groupCode": notify.group.groupCode,
                            "postscript": reason
                        }
                    }
                },
                null
            ]
        });
    }

    static async quitGroup(groupQQ: string) {
        await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.QUIT_GROUP,
            args: [
                {"groupCode": groupQQ},
                null
            ]
        })
    }

    static async handleFriendRequest(sourceId: number, accept: boolean,) {
        const request: FriendRequest = friendRequests[sourceId]
        if (!request) {
            throw `sourceId ${sourceId}, 对应的好友请求不存在`
        }
        const result = await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.HANDLE_FRIEND_REQUEST,
            args: [
                {
                    "approvalInfo": {
                        "friendUid": request.friendUid,
                        "reqTime": request.reqTime,
                        accept
                    }
                }
            ]
        })
        delete friendRequests[sourceId];
        return result;
    }

    static async kickMember(groupQQ: string, kickUids: string[], refuseForever: boolean = false, kickReason: string = '') {
        return await callNTQQApi<GeneralCallResult>(
            {
                methodName: NTQQApiMethod.KICK_MEMBER,
                args: [
                    {
                        groupCode: groupQQ,
                        kickUids,
                        refuseForever,
                        kickReason,
                    }
                ]
            }
        )
    }

    static async banMember(groupQQ: string, memList: Array<{ uid: string, timeStamp: number }>) {
        // timeStamp为秒数, 0为解除禁言
        return await callNTQQApi<GeneralCallResult>(
            {
                methodName: NTQQApiMethod.MUTE_MEMBER,
                args: [
                    {
                        groupCode: groupQQ,
                        memList,
                    }
                ]
            }
        )
    }

    static async banGroup(groupQQ: string, shutUp: boolean) {
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.MUTE_GROUP,
            args: [
                {
                    groupCode: groupQQ,
                    shutUp
                }, null
            ]
        })
    }

    static async setMemberCard(groupQQ: string, memberUid: string, cardName: string) {
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.SET_MEMBER_CARD,
            args: [
                {
                    groupCode: groupQQ,
                    uid: memberUid,
                    cardName
                }, null
            ]
        })
    }

    static async setMemberRole(groupQQ: string, memberUid: string, role: GroupMemberRole) {
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.SET_MEMBER_ROLE,
            args: [
                {
                    groupCode: groupQQ,
                    uid: memberUid,
                    role
                }, null
            ]
        })
    }

    static async setGroupName(groupQQ: string, groupName: string) {
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.SET_GROUP_NAME,
            args: [
                {
                    groupCode: groupQQ,
                    groupName
                }, null
            ]
        })
    }

    static publishGroupBulletin(groupQQ: string, title: string, content: string) {

    }

    static async setCacheSilentScan(isSilent: boolean = true) {
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.CACHE_SET_SILENCE,
            args: [{
                isSilent
            }, null]
        });
    }

    static addCacheScannedPaths(pathMap: object = {}) {
        return callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.CACHE_ADD_SCANNED_PATH,
            args: [{
                pathMap: {...pathMap},
            }, null]
        });
    }

    static scanCache() {
        callNTQQApi<GeneralCallResult>({
            methodName: ReceiveCmd.CACHE_SCAN_FINISH,
            classNameIsRegister: true,
        }).then();
        return callNTQQApi<CacheScanResult>({
            methodName: NTQQApiMethod.CACHE_SCAN,
            args: [null, null],
            timeoutSecond: 300,
        });
    }

    static getHotUpdateCachePath() {
        return callNTQQApi<string>({
            className: NTQQApiClass.HOTUPDATE_API,
            methodName: NTQQApiMethod.CACHE_PATH_HOT_UPDATE
        });
    }

    static getDesktopTmpPath() {
        return callNTQQApi<string>({
            className: NTQQApiClass.BUSINESS_API,
            methodName: NTQQApiMethod.CACHE_PATH_DESKTOP_TEMP
        });
    }

    static getCacheSessionPathList() {
        return callNTQQApi<{
            key: string,
            value: string
        }[]>({
            className: NTQQApiClass.OS_API,
            methodName: NTQQApiMethod.CACHE_PATH_SESSION,
        });
    }

    static clearCache(cacheKeys: Array<string> = [ 'tmp', 'hotUpdate' ]) {
        return callNTQQApi<any>({ // TODO: 目前还不知道真正的返回值是什么
            methodName: NTQQApiMethod.CACHE_CLEAR,
            args: [{
                keys: cacheKeys
            }, null]
        });
    }

    static getChatCacheList(type: ChatType, pageSize: number = 1000, pageIndex: number = 0) {
        return new Promise<ChatCacheList>((res, rej) => {
            callNTQQApi<ChatCacheList>({
                methodName: NTQQApiMethod.CACHE_CHAT_GET,
                args: [{
                    chatType: type,
                    pageSize,
                    order: 1,
                    pageIndex
                }, null]
            }).then(list => res(list))
            .catch(e => rej(e));
        });
    }

    static getFileCacheInfo(fileType: CacheFileType, pageSize: number = 1000, lastRecord?: CacheFileListItem) {
        const _lastRecord = lastRecord ? lastRecord : { fileType: fileType };

        return callNTQQApi<CacheFileList>({
            methodName: NTQQApiMethod.CACHE_FILE_GET,
            args: [{
                fileType: fileType,
                restart: true,
                pageSize: pageSize,
                order: 1,
                lastRecord: _lastRecord,
            }, null]
        })
    }

    static async clearChatCache(chats: ChatCacheListItemBasic[] = [], fileKeys: string[] = []) {
        return await callNTQQApi<GeneralCallResult>({
            methodName: NTQQApiMethod.CACHE_CHAT_CLEAR,
            args: [{
                chats,
                fileKeys
            }, null]
        });
    }
}