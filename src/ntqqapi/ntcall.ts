import { ipcMain } from 'electron'
import { hookApiCallbacks, registerReceiveHook, removeReceiveHook } from './hook'
import { log } from '../common/utils/log'
import { randomUUID } from 'node:crypto'
import { GeneralCallResult } from './services'

export enum NTClass {
  NT_API = 'ns-ntApi',
  FS_API = 'ns-FsApi',
  OS_API = 'ns-OsApi',
  WINDOW_API = 'ns-WindowApi',
  HOTUPDATE_API = 'ns-HotUpdateApi',
  BUSINESS_API = 'ns-BusinessApi',
  GLOBAL_DATA = 'ns-GlobalDataApi',
  SKEY_API = 'ns-SkeyApi',
  GROUP_HOME_WORK = 'ns-GroupHomeWork',
  GROUP_ESSENCE = 'ns-GroupEssence',
  NODE_STORE_API = 'ns-NodeStoreApi'
}

export enum NTMethod {
  RECENT_CONTACT = 'nodeIKernelRecentContactService/fetchAndSubscribeABatchOfRecentContact',
  ACTIVE_CHAT_PREVIEW = 'nodeIKernelMsgService/getAioFirstViewLatestMsgsAndAddActiveChat', // 激活聊天窗口，有时候必须这样才能收到消息, 并返回最新预览消息
  ACTIVE_CHAT_HISTORY = 'nodeIKernelMsgService/getMsgsIncludeSelfAndAddActiveChat', // 激活聊天窗口，有时候必须这样才能收到消息, 并返回历史消息
  HISTORY_MSG = 'nodeIKernelMsgService/getMsgsIncludeSelf',
  GET_MULTI_MSG = 'nodeIKernelMsgService/getMultiMsg',
  DELETE_ACTIVE_CHAT = 'nodeIKernelMsgService/deleteActiveChatByUid',
  ENTER_OR_EXIT_AIO = 'nodeIKernelMsgService/enterOrExitAio',

  LIKE_FRIEND = 'nodeIKernelProfileLikeService/setBuddyProfileLike',
  SELF_INFO = 'fetchAuthData',
  FRIENDS = 'nodeIKernelBuddyService/getBuddyList',

  GROUPS = 'nodeIKernelGroupService/getGroupList',
  GROUP_MEMBER_SCENE = 'nodeIKernelGroupService/createMemberListScene',
  GROUP_MEMBERS = 'nodeIKernelGroupService/getNextMemberList',
  GROUP_MEMBERS_INFO = 'nodeIKernelGroupService/getMemberInfo',

  USER_INFO = 'nodeIKernelProfileService/getUserSimpleInfo',
  USER_DETAIL_INFO = 'nodeIKernelProfileService/getUserDetailInfo',
  USER_DETAIL_INFO_WITH_BIZ_INFO = 'nodeIKernelProfileService/getUserDetailInfoWithBizInfo',
  FILE_TYPE = 'getFileType',
  FILE_MD5 = 'getFileMd5',
  FILE_COPY = 'copyFile',
  IMAGE_SIZE = 'getImageSizeFromPath',
  FILE_SIZE = 'getFileSize',
  MEDIA_FILE_PATH = 'nodeIKernelMsgService/getRichMediaFilePathForGuild',

  RECALL_MSG = 'nodeIKernelMsgService/recallMsg',
  SEND_MSG = 'nodeIKernelMsgService/sendMsg',
  PREPARE_TEMP_CHAT = "nodeIKernelMsgService/prepareTempChat",
  EMOJI_LIKE = 'nodeIKernelMsgService/setMsgEmojiLikes',

  DOWNLOAD_MEDIA = 'nodeIKernelMsgService/downloadRichMedia',
  FORWARD_MSG = 'nodeIKernelMsgService/forwardMsgWithComment',
  MULTI_FORWARD_MSG = 'nodeIKernelMsgService/multiForwardMsgWithComment', // 合并转发
  GET_GROUP_NOTICE = 'nodeIKernelGroupService/getSingleScreenNotifies',
  HANDLE_GROUP_REQUEST = 'nodeIKernelGroupService/operateSysNotify',
  QUIT_GROUP = 'nodeIKernelGroupService/quitGroup',
  GROUP_AT_ALL_REMAIN_COUNT = 'nodeIKernelGroupService/getGroupRemainAtTimes',
  HANDLE_FRIEND_REQUEST = 'nodeIKernelBuddyService/approvalFriendRequest',
  KICK_MEMBER = 'nodeIKernelGroupService/kickMember',
  MUTE_MEMBER = 'nodeIKernelGroupService/setMemberShutUp',
  MUTE_GROUP = 'nodeIKernelGroupService/setGroupShutUp',
  SET_MEMBER_CARD = 'nodeIKernelGroupService/modifyMemberCardName',
  SET_MEMBER_ROLE = 'nodeIKernelGroupService/modifyMemberRole',
  PUBLISH_GROUP_BULLETIN = 'nodeIKernelGroupService/publishGroupBulletinBulletin',
  SET_GROUP_NAME = 'nodeIKernelGroupService/modifyGroupName',
  SET_GROUP_TITLE = 'nodeIKernelGroupService/modifyMemberSpecialTitle',
  ACTIVATE_MEMBER_LIST_CHANGE = 'nodeIKernelGroupListener/onMemberListChange',
  ACTIVATE_MEMBER_INFO_CHANGE = 'nodeIKernelGroupListener/onMemberInfoChange',
  GET_MSG_BOX_INFO = 'nodeIKernelMsgService/getABatchOfContactMsgBoxInfo',
  GET_GROUP_ALL_INFO = 'nodeIKernelGroupService/getGroupAllInfo',

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

  SET_QQ_AVATAR = 'nodeIKernelProfileService/setHeader',
}

export enum NTChannel {
  IPC_UP_2 = 'IPC_UP_2',
  IPC_UP_3 = 'IPC_UP_3',
  IPC_UP_1 = 'IPC_UP_1',
}

interface InvokeParams<ReturnType> {
  methodName: string
  className?: NTClass
  channel?: NTChannel
  classNameIsRegister?: boolean
  args?: unknown[]
  cbCmd?: string | string[]
  cmdCB?: (payload: ReturnType) => boolean
  afterFirstCmd?: boolean // 是否在methodName调用完之后再去hook cbCmd
  timeout?: number
}

export function invoke<ReturnType>(params: InvokeParams<ReturnType>) {
  const className = params.className ?? NTClass.NT_API
  const channel = params.channel ?? NTChannel.IPC_UP_2
  const timeout = params.timeout ?? 5000
  const afterFirstCmd = params.afterFirstCmd ?? true
  const uuid = randomUUID()
  let eventName = className + '-' + channel[channel.length - 1]
  if (params.classNameIsRegister) {
    eventName += '-register'
  }
  const apiArgs = [params.methodName, ...(params.args ?? [])]
  //log('callNTQQApi', channel, eventName, apiArgs, uuid)
  return new Promise((resolve: (data: ReturnType) => void, reject) => {
    let success = false
    if (!params.cbCmd) {
      // QQ后端会返回结果，并且可以根据uuid识别
      hookApiCallbacks[uuid] = (r: ReturnType) => {
        success = true
        resolve(r)
      }
    }
    else {
      // 这里的callback比较特殊，QQ后端先返回是否调用成功，再返回一条结果数据
      const secondCallback = () => {
        const hookId = registerReceiveHook<ReturnType>(params.cbCmd!, (payload) => {
          // log(methodName, "second callback", cbCmd, payload, cmdCB);
          if (!!params.cmdCB) {
            if (params.cmdCB(payload)) {
              removeReceiveHook(hookId)
              success = true
              resolve(payload)
            }
          }
          else {
            removeReceiveHook(hookId)
            success = true
            resolve(payload)
          }
        })
      }
      !afterFirstCmd && secondCallback()
      hookApiCallbacks[uuid] = (result: GeneralCallResult) => {
        if (result?.result === 0 || result === undefined) {
          log(`${params.methodName} callback`, result)
          afterFirstCmd && secondCallback()
        }
        else {
          log('ntqq api call failed', result)
          reject(`ntqq api call failed, ${result.errMsg}`)
        }
      }
    }
    setTimeout(() => {
      if (!success) {
        log(`ntqq api timeout ${channel}, ${eventName}, ${params.methodName}`, apiArgs)
        reject(`ntqq api timeout ${channel}, ${eventName}, ${params.methodName}, ${apiArgs}`)
      }
    }, timeout)

    ipcMain.emit(
      channel,
      {
        sender: {
          send: (..._args: unknown[]) => {
          },
        },
      },
      { type: 'request', callbackId: uuid, eventName },
      apiArgs,
    )
  })
}
