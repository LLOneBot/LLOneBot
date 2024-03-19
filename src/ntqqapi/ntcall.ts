import {ipcMain} from "electron";
import {hookApiCallbacks, ReceiveCmd, registerReceiveHook, removeReceiveHook} from "./hook";

import {v4 as uuidv4} from "uuid"
import {log} from "../common/utils/log";

export enum NTQQApiClass {
    NT_API = "ns-ntApi",
    FS_API = "ns-FsApi",
    OS_API = "ns-OsApi",
    WINDOW_API = "ns-WindowApi",
    HOTUPDATE_API = "ns-HotUpdateApi",
    BUSINESS_API = "ns-BusinessApi",
    GLOBAL_DATA = "ns-GlobalDataApi"
}

export enum NTQQApiMethod {
    RECENT_CONTACT = "nodeIKernelRecentContactService/fetchAndSubscribeABatchOfRecentContact",
    ADD_ACTIVE_CHAT = "nodeIKernelMsgService/getAioFirstViewLatestMsgsAndAddActiveChat",  // 激活群助手内的聊天窗口，这样才能收到消息
    ADD_ACTIVE_CHAT_2 = "nodeIKernelMsgService/getMsgsIncludeSelfAndAddActiveChat",
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
    SET_GROUP_TITLE = "nodeIKernelGroupService/modifyMemberSpecialTitle",

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

    OPEN_EXTRA_WINDOW = 'openExternalWindow',

    SET_QQ_AVATAR = 'nodeIKernelProfileService/setHeader'
}

enum NTQQApiChannel {
    IPC_UP_2 = "IPC_UP_2",
    IPC_UP_3 = "IPC_UP_3",
    IPC_UP_1 = "IPC_UP_1",
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

export function callNTQQApi<ReturnType>(params: NTQQApiParams) {
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


export interface GeneralCallResult {
    result: number,  // 0: success
    errMsg: string
}


export class NTQQApi {
    static async call(className: NTQQApiClass, cmdName: string, args: any[],) {
        return await callNTQQApi<GeneralCallResult>({
            className,
            methodName: cmdName,
            args: [
                ...args,
            ]
        })
    }

}