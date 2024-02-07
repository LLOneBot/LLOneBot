import {ipcMain} from "electron";
import {v4 as uuidv4} from "uuid";
import {hookApiCallbacks} from "./hook";
import {log} from "../common/utils";
import {ChatType, Group, GroupMember, User} from "../common/types";
import {SendMessageElement} from "./types";

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
    GLOBAL_DATA = "ns-GlobalDataApi"
}

export enum NTQQApiMethod {
    LIKE_FRIEND = "nodeIKernelProfileLikeService/setBuddyProfileLike",
    UPDATE_MSG = "nodeIKernelMsgListener/onMsgInfoListUpdate",
    SELF_INFO = "fetchAuthData",
    FRIENDS = "nodeIKernelProfileService/getBuddyProfileList",
    GROUPS = "nodeIKernelGroupService/getGroupList",
    GROUP_MEMBER_SCENE = "nodeIKernelGroupService/createMemberListScene",
    GROUP_MEMBERS = "nodeIKernelGroupService/getNextMemberList",
    USER_INFO = "nodeIKernelProfileService/getUserSimpleInfo",
    FILE_TYPE = "getFileType",
    FILE_MD5 = "getFileMd5",
    FILE_COPY = "copyFile",
    IMAGE_SIZE = "getImageSizeFromPath",
    FILE_SIZE = "getFileSize",
    MEDIA_FILE_PATH = "nodeIKernelMsgService/getRichMediaFilePathForGuild",
    RECALL_MSG = "nodeIKernelMsgService/recallMsg",
    SEND_MSG = "nodeIKernelMsgService/sendMsg",
}

enum NTQQApiChannel {
    IPC_UP_2 = "IPC_UP_2",
    IPC_UP_3 = "IPC_UP_3",
    IPC_UP_1 = "IPC_UP_1",
}

interface Peer {
    chatType: ChatType
    peerUid: string  // 是uid还是QQ号
    guildId?: ""
}


function callNTQQApi<ReturnType>(channel: NTQQApiChannel, className: NTQQApiClass, methodName: NTQQApiMethod, args: unknown[] = []) {
    const uuid = uuidv4();
    // log("callNTQQApi", channel, className, methodName, args, uuid)
    return new Promise((resolve: (data: ReturnType) => void, reject) => {
        // log("callNTQQApiPromise", channel, className, methodName, args, uuid)
        hookApiCallbacks[uuid] = resolve;
        ipcMain.emit(
            channel,
            {},
            {type: 'request', callbackId: uuid, eventName: className + "-" + channel[channel.length - 1]},
            [methodName, ...args],
        )
    })
}


export class NTQQApi {
    // static likeFriend = defineNTQQApi<void>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.LIKE_FRIEND)
    static likeFriend(uid: string, count = 1) {
        return callNTQQApi(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.LIKE_FRIEND, [{
            doLikeUserInfo: {
                friendUid: uid,
                sourceId: 71,
                doLikeCount: count,
                doLikeTollCount: 0
            }
        },
            null])
    }

    static getSelfInfo() {
        return callNTQQApi<User>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.GLOBAL_DATA, NTQQApiMethod.SELF_INFO, [])

    }

    static getFriends(forced = false) {
        return callNTQQApi(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.FRIENDS, [{force_update: forced}, undefined])
    }

    static getGroups(forced = false) {
        return callNTQQApi<Group[]>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.GROUPS, [{force_update: forced}, undefined])
    }

    static async getGroupMembers(groupQQ: string, num = 3000) {
        const sceneId = callNTQQApi(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.GROUP_MEMBER_SCENE, [{
                groupCode: groupQQ,
                scene: "groupMemberList_MainWindow"
            }]
        )
        return callNTQQApi<GroupMember[]>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.GROUP_MEMBERS,
            [{
                sceneId: sceneId,
                num: num
            },
                null
            ])
    }

    static async getUserInfo(uid: string) {
        const result = await callNTQQApi<[{
            payload: { profiles: Map<string, User> }
        }]>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.USER_INFO,
            [{force: true, uids: [uid]}, undefined])
        return new Promise<User>(resolve => {
            resolve(result[0].payload.profiles.get(uid))
        })
    }

    static getFileType(filePath: string) {
        return callNTQQApi<{
            ext: string
        }>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.FS_API, NTQQApiMethod.FILE_TYPE, [filePath])
    }

    static getFileMd5(filePath: string) {
        return callNTQQApi<string>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.FS_API, NTQQApiMethod.FILE_MD5, [filePath])
    }

    static copyFile(filePath: string, destPath: string) {
        return callNTQQApi<string>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.FS_API, NTQQApiMethod.FILE_COPY, [filePath, destPath])
    }

    static getImageSize(filePath: string) {
        return callNTQQApi<{
            width: number,
            height: number
        }>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.FS_API, NTQQApiMethod.IMAGE_SIZE, [filePath])
    }

    static getFileSize(filePath: string) {
        return callNTQQApi<number>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.FS_API, NTQQApiMethod.FILE_SIZE, [filePath])
    }

    // 上传文件到QQ的文件夹
    static async uploadFile(filePath: string) {
        const md5 = await NTQQApi.getFileMd5(filePath);
        const fileName = `${md5}.${(await NTQQApi.getFileType(filePath)).ext}`;
        const mediaPath = await callNTQQApi<string>(NTQQApiChannel.IPC_UP_2, NTQQApiClass.FS_API, NTQQApiMethod.MEDIA_FILE_PATH, [{
            path_info: {
                md5HexStr: md5,
                fileName: fileName,
                elementType: 2,
                elementSubType: 0,
                thumbSize: 0,
                needCreate: true,
                downloadType: 1,
                file_uuid: ""
            }
        }])
        await NTQQApi.copyFile(filePath, mediaPath);
        const fileSize = await NTQQApi.getFileSize(filePath);
        return {
            md5,
            fileName,
            path: mediaPath,
            fileSize
        }
    }

    static recallMsg(peer: Peer, msgIds: string[]){
        return callNTQQApi(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.RECALL_MSG, [{peer, msgIds}, null])
    }

    static sendMsg(peer: Peer, msgElements: SendMessageElement){
        return callNTQQApi(NTQQApiChannel.IPC_UP_2, NTQQApiClass.NT_API, NTQQApiMethod.SEND_MSG, [{
            msgId: "0",
            peer, msgElements,
            msgAttributeInfos: new Map(),
        }, null])
    }
}