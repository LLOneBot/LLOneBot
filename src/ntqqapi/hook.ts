import type { BrowserWindow } from 'electron'
import { NTClass, NTMethod } from './ntcall'
import { NTQQMsgApi, NTQQFriendApi } from './api'
import {
  CategoryFriend,
  ChatType,
  GroupMember,
  GroupMemberRole,
  RawMessage,
  SimpleInfo,
  User
} from './types'
import {
  getGroupMember,
  setSelfInfo
} from '@/common/data'
import { postOb11Event } from '../onebot11/server/post-ob11-event'
import { getConfigUtil } from '@/common/config'
import fs from 'node:fs'
import { log } from '@/common/utils'
import { randomUUID } from 'node:crypto'
import { MessageUnique } from '../common/utils/MessageUnique'
import { isNumeric, sleep } from '@/common/utils'
import { OB11Constructor } from '../onebot11/constructor'
import { OB11GroupCardEvent } from '../onebot11/event/notice/OB11GroupCardEvent'
import { OB11GroupAdminNoticeEvent } from '../onebot11/event/notice/OB11GroupAdminNoticeEvent'

export let hookApiCallbacks: Record<string, (apiReturn: any) => void> = {}

export let ReceiveCmdS = {
  RECENT_CONTACT: 'nodeIKernelRecentContactListener/onRecentContactListChangedVer2',
  UPDATE_MSG: 'nodeIKernelMsgListener/onMsgInfoListUpdate',
  UPDATE_ACTIVE_MSG: 'nodeIKernelMsgListener/onActiveMsgInfoUpdate',
  NEW_MSG: `nodeIKernelMsgListener/onRecvMsg`,
  NEW_ACTIVE_MSG: `nodeIKernelMsgListener/onRecvActiveMsg`,
  SELF_SEND_MSG: 'nodeIKernelMsgListener/onAddSendMsg',
  USER_INFO: 'nodeIKernelProfileListener/onProfileSimpleChanged',
  USER_DETAIL_INFO: 'nodeIKernelProfileListener/onProfileDetailInfoChanged',
  GROUPS: 'nodeIKernelGroupListener/onGroupListUpdate',
  GROUPS_STORE: 'onGroupListUpdate',
  GROUP_MEMBER_INFO_UPDATE: 'nodeIKernelGroupListener/onMemberInfoChange',
  FRIENDS: 'onBuddyListChange',
  MEDIA_DOWNLOAD_COMPLETE: 'nodeIKernelMsgListener/onRichMediaDownloadComplete',
  UNREAD_GROUP_NOTIFY: 'nodeIKernelGroupListener/onGroupNotifiesUnreadCountUpdated',
  GROUP_NOTIFY: 'nodeIKernelGroupListener/onGroupSingleScreenNotifies',
  FRIEND_REQUEST: 'nodeIKernelBuddyListener/onBuddyReqChange',
  SELF_STATUS: 'nodeIKernelProfileListener/onSelfStatusChanged',
  CACHE_SCAN_FINISH: 'nodeIKernelStorageCleanListener/onFinishScan',
  MEDIA_UPLOAD_COMPLETE: 'nodeIKernelMsgListener/onRichMediaUploadComplete',
  SKEY_UPDATE: 'onSkeyUpdate',
} as const

export type ReceiveCmd = string

interface NTQQApiReturnData<Payload = unknown> extends Array<any> {
  0: {
    type: 'request'
    eventName: NTClass
    callbackId?: string
  }
  1: {
    cmdName: ReceiveCmd
    cmdType: 'event'
    payload: Payload
  }[]
}

const logHook = false

const receiveHooks: Array<{
  method: ReceiveCmd[]
  hookFunc: (payload: any) => void | Promise<void>
  id: string
}> = []

const callHooks: Array<{
  method: NTMethod[]
  hookFunc: (callParams: unknown[]) => void | Promise<void>
}> = []

export function hookNTQQApiReceive(window: BrowserWindow) {
  const originalSend = window.webContents.send
  const patchSend = (channel: string, ...args: NTQQApiReturnData) => {
    try {
      const isLogger = args[0]?.eventName?.startsWith('ns-LoggerApi')
      if (logHook && !isLogger) {
        log(`received ntqq api message: ${channel}`, args)
      }
    } catch { }
    if (args?.[1] instanceof Array) {
      for (const receiveData of args?.[1]) {
        const ntQQApiMethodName = receiveData.cmdName
        // log(`received ntqq api message: ${channel} ${ntQQApiMethodName}`, JSON.stringify(receiveData))
        for (const hook of receiveHooks) {
          if (hook.method.includes(ntQQApiMethodName)) {
            new Promise((resolve, reject) => {
              try {
                hook.hookFunc(receiveData.payload)
              } catch (e: any) {
                log('hook error', ntQQApiMethodName, e.stack.toString())
              }
              resolve(undefined)
            }).then()
          }
        }
      }
    }
    if (args[0]?.callbackId) {
      // log("hookApiCallback", hookApiCallbacks, args)
      const callbackId = args[0].callbackId
      if (hookApiCallbacks[callbackId]) {
        // log("callback found")
        new Promise((resolve, reject) => {
          hookApiCallbacks[callbackId](args[1])
          resolve(undefined)
        }).then()
        delete hookApiCallbacks[callbackId]
      }
    }
    originalSend.call(window.webContents, channel, ...args)
  }
  window.webContents.send = patchSend
}

export function hookNTQQApiCall(window: BrowserWindow) {
  // 监听调用NTQQApi
  let webContents = window.webContents as any
  const ipc_message_proxy = webContents._events['-ipc-message']?.[0] || webContents._events['-ipc-message']

  const proxyIpcMsg = new Proxy(ipc_message_proxy, {
    apply(target, thisArg, args) {
      // console.log(thisArg, args);
      let isLogger = false
      try {
        isLogger = args[3][0].eventName.startsWith('ns-LoggerApi')
      } catch (e) { }
      if (!isLogger) {
        try {
          logHook && log('call NTQQ api', thisArg, args)
        } catch (e) { }
        try {
          const _args: unknown[] = args[3][1]
          const cmdName: NTMethod = _args[0] as NTMethod
          const callParams = _args.slice(1)
          callHooks.forEach((hook) => {
            if (hook.method.includes(cmdName)) {
              new Promise((resolve, reject) => {
                try {
                  hook.hookFunc(callParams)
                } catch (e: any) {
                  log('hook call error', e, _args)
                }
                resolve(undefined)
              }).then()
            }
          })
        } catch (e) { }
      }
      return target.apply(thisArg, args)
    },
  })
  if (webContents._events['-ipc-message']?.[0]) {
    webContents._events['-ipc-message'][0] = proxyIpcMsg
  } else {
    webContents._events['-ipc-message'] = proxyIpcMsg
  }

  const ipc_invoke_proxy = webContents._events['-ipc-invoke']?.[0] || webContents._events['-ipc-invoke']
  const proxyIpcInvoke = new Proxy(ipc_invoke_proxy, {
    apply(target, thisArg, args) {
      // console.log(args);
      //HOOK_LOG && log('call NTQQ invoke api', thisArg, args)
      args[0]['_replyChannel']['sendReply'] = new Proxy(args[0]['_replyChannel']['sendReply'], {
        apply(sendtarget, sendthisArg, sendargs) {
          sendtarget.apply(sendthisArg, sendargs)
        },
      })
      let ret = target.apply(thisArg, args)
      /*try {
        HOOK_LOG && log('call NTQQ invoke api return', ret)
      } catch (e) { }*/
      return ret
    },
  })
  if (webContents._events['-ipc-invoke']?.[0]) {
    webContents._events['-ipc-invoke'][0] = proxyIpcInvoke
  } else {
    webContents._events['-ipc-invoke'] = proxyIpcInvoke
  }
}

export function registerReceiveHook<PayloadType>(
  method: ReceiveCmd | ReceiveCmd[],
  hookFunc: (payload: PayloadType) => void,
): string {
  const id = randomUUID()
  if (!Array.isArray(method)) {
    method = [method]
  }
  receiveHooks.push({
    method,
    hookFunc,
    id,
  })
  return id
}

export function registerCallHook(
  method: NTMethod | NTMethod[],
  hookFunc: (callParams: unknown[]) => void | Promise<void>,
): void {
  if (!Array.isArray(method)) {
    method = [method]
  }
  callHooks.push({
    method,
    hookFunc,
  })
}

export function removeReceiveHook(id: string) {
  const index = receiveHooks.findIndex((h) => h.id === id)
  receiveHooks.splice(index, 1)
}

export async function startHook() {
  registerReceiveHook<{
    groupCode: string
    dataSource: number
    members: Set<GroupMember>
  }>(ReceiveCmdS.GROUP_MEMBER_INFO_UPDATE, async (payload) => {
    const groupCode = payload.groupCode
    const members = Array.from(payload.members.values())
    // log("群成员信息变动", groupCode, members)
    for (const member of members) {
      const existMember = await getGroupMember(groupCode, member.uin)
      if (existMember) {
        if (member.cardName != existMember.cardName) {
          log('群成员名片变动', `${groupCode}: ${existMember.uin}`, existMember.cardName, '->', member.cardName)
          postOb11Event(
            new OB11GroupCardEvent(parseInt(groupCode), parseInt(member.uin), member.cardName, existMember.cardName),
          )
        } else if (member.role != existMember.role) {
          log('有管理员变动通知')
          const groupAdminNoticeEvent = new OB11GroupAdminNoticeEvent(
            member.role == GroupMemberRole.admin ? 'set' : 'unset',
            parseInt(groupCode),
            parseInt(member.uin)
          )
          postOb11Event(groupAdminNoticeEvent, true)
        }
        Object.assign(existMember, member)
      }
    }
    // const existGroup = groups.find(g => g.groupCode == groupCode);
    // if (existGroup) {
    //     log("对比群成员", existGroup.members, members)
    //     for (const member of members) {
    //         const existMember = existGroup.members.find(m => m.uin == member.uin);
    //         if (existMember) {
    //             log("对比群名片", existMember.cardName, member.cardName)
    //             if (existMember.cardName != member.cardName) {
    //                 postOB11Event(new OB11GroupCardEvent(parseInt(existGroup.groupCode), parseInt(member.uin), member.cardName, existMember.cardName));
    //             }
    //             Object.assign(existMember, member);
    //         }
    //     }
    // }
  })

  // 好友列表变动
  registerReceiveHook<{
    data: CategoryFriend[]
  }>(ReceiveCmdS.FRIENDS, (payload) => {
    // log("onBuddyListChange", payload)
    // let friendListV2: {userSimpleInfos: Map<string, SimpleInfo>} = []
    type V2data = { userSimpleInfos: Map<string, SimpleInfo> }
    let friendList: User[] = [];
    if ((payload as any).userSimpleInfos) {
      // friendListV2 = payload as any
      friendList = Object.values((payload as unknown as V2data).userSimpleInfos).map((v: SimpleInfo) => {
        return {
          ...v.coreInfo,
        }
      })
    }
    else {
      for (const fData of payload.data) {
        friendList.push(...fData.buddyList)
      }
    }
    log('好友列表变动', friendList.length)
    for (let friend of friendList) {
      NTQQMsgApi.activateChat({ peerUid: friend.uid, chatType: ChatType.friend }).then()
    }
  })

  registerReceiveHook<{ msgList: Array<RawMessage> }>([ReceiveCmdS.NEW_MSG, ReceiveCmdS.NEW_ACTIVE_MSG], (payload) => {
    // 自动清理新消息文件
    const { autoDeleteFile } = getConfigUtil().getConfig()
    if (!autoDeleteFile) {
      return
    }
    for (const message of payload.msgList) {
      // log("收到新消息，push到历史记录", message.msgId)
      // dbUtil.addMsg(message).then()
      // 清理文件

      for (const msgElement of message.elements) {
        setTimeout(() => {
          const picPath = msgElement.picElement?.sourcePath
          const picThumbPath = [...msgElement.picElement?.thumbPath.values()]
          const pttPath = msgElement.pttElement?.filePath
          const filePath = msgElement.fileElement?.filePath
          const videoPath = msgElement.videoElement?.filePath
          const videoThumbPath: string[] = [...msgElement.videoElement.thumbPath?.values()!]
          const pathList = [picPath, ...picThumbPath, pttPath, filePath, videoPath, ...videoThumbPath]
          if (msgElement.picElement) {
            pathList.push(...Object.values(msgElement.picElement.thumbPath))
          }

          // log("需要清理的文件", pathList);
          for (const path of pathList) {
            if (path) {
              fs.unlink(picPath, () => {
                log('删除文件成功', path)
              })
            }
          }
        }, getConfigUtil().getConfig().autoDeleteFileSecond! * 1000)
      }
    }
  })

  registerReceiveHook<{ msgRecord: RawMessage }>(ReceiveCmdS.SELF_SEND_MSG, ({ msgRecord }) => {
    const { msgId, chatType, peerUid } = msgRecord
    const peer = {
      chatType,
      peerUid
    }
    MessageUnique.createMsg(peer, msgId)
  })

  registerReceiveHook<{ info: { status: number } }>(ReceiveCmdS.SELF_STATUS, (info) => {
    setSelfInfo({
      online: info.info.status !== 20
    })
  })

  let activatedPeerUids: string[] = []
  registerReceiveHook<{
    changedRecentContactLists: {
      listType: number
      sortedContactList: string[]
      changedList: {
        id: string // peerUid
        chatType: ChatType
      }[]
    }[]
  }>(ReceiveCmdS.RECENT_CONTACT, async (payload) => {
    for (const recentContact of payload.changedRecentContactLists) {
      for (const changedContact of recentContact.changedList) {
        if (activatedPeerUids.includes(changedContact.id)) continue
        activatedPeerUids.push(changedContact.id)
        const peer = { peerUid: changedContact.id, chatType: changedContact.chatType }
        if (changedContact.chatType === ChatType.temp) {
          log('收到临时会话消息', peer)
          NTQQMsgApi.activateChatAndGetHistory(peer).then(() => {
            NTQQMsgApi.getMsgHistory(peer, '', 20).then(({ msgList }) => {
              let lastTempMsg = msgList.pop()
              log('激活窗口之前的第一条临时会话消息:', lastTempMsg)
              if (Date.now() / 1000 - parseInt(lastTempMsg?.msgTime!) < 5) {
                OB11Constructor.message(lastTempMsg!).then((r) => postOb11Event(r))
              }
            })
          })
        }
        else {
          NTQQMsgApi.activateChat(peer).then()
        }
      }
    }
  })

  registerCallHook(NTMethod.DELETE_ACTIVE_CHAT, async (payload) => {
    const peerUid = payload[0] as string
    log('激活的聊天窗口被删除，准备重新激活', peerUid)
    let chatType = ChatType.friend
    if (isNumeric(peerUid)) {
      chatType = ChatType.group
    }
    else if (!(await NTQQFriendApi.isBuddy(peerUid))) {
      chatType = ChatType.temp
    }
    const peer = { peerUid, chatType }
    await sleep(1000)
    NTQQMsgApi.activateChat(peer).then((r) => {
      log('重新激活聊天窗口', peer, { result: r.result, errMsg: r.errMsg })
    })
  })
}
