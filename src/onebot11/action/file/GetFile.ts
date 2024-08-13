import BaseAction from '../BaseAction'
import fsPromise from 'node:fs/promises'
import { getConfigUtil } from '@/common/config'
import { NTQQFileApi, NTQQGroupApi, NTQQUserApi, NTQQFriendApi, NTQQMsgApi } from '@/ntqqapi/api'
import { ActionName } from '../types'
import { RawMessage } from '@/ntqqapi/types'
import { UUIDConverter } from '@/common/utils/helper'
import { Peer, ChatType, ElementType } from '@/ntqqapi/types'

export interface GetFilePayload {
  file: string // 文件名或者fileUuid
}

export interface GetFileResponse {
  file?: string // path
  url?: string
  file_size?: string
  file_name?: string
  base64?: string
}

export abstract class GetFileBase extends BaseAction<GetFilePayload, GetFileResponse> {
  // forked from https://github.com/NapNeko/NapCatQQ/blob/6f6b258f22d7563f15d84e7172c4d4cbb547f47e/src/onebot11/action/file/GetFile.ts#L44
  protected async _handle(payload: GetFilePayload): Promise<GetFileResponse> {
    const { enableLocalFile2Url } = getConfigUtil().getConfig()
    let UuidData: {
      high: string
      low: string
    } | undefined
    try {
      UuidData = UUIDConverter.decode(payload.file)
      if (UuidData) {
        const peerUin = UuidData.high
        const msgId = UuidData.low
        const isGroup: boolean = !!(await NTQQGroupApi.getGroups(false)).find(e => e.groupCode == peerUin)
        let peer: Peer | undefined
        //识别Peer
        if (isGroup) {
          peer = { chatType: ChatType.group, peerUid: peerUin }
        }
        const PeerUid = await NTQQUserApi.getUidByUinV2(peerUin)
        if (PeerUid) {
          const isBuddy = await NTQQFriendApi.isBuddy(PeerUid)
          if (isBuddy) {
            peer = { chatType: ChatType.friend, peerUid: PeerUid }
          } else {
            peer = { chatType: ChatType.temp, peerUid: PeerUid }
          }
        }
        if (!peer) {
          throw new Error('chattype not support')
        }
        const msgList = await NTQQMsgApi.getMsgsByMsgId(peer, [msgId])
        if (msgList.msgList.length == 0) {
          throw new Error('msg not found')
        }
        const msg = msgList.msgList[0];
        const findEle = msg.elements.find(e => e.elementType == ElementType.VIDEO || e.elementType == ElementType.FILE || e.elementType == ElementType.PTT)
        if (!findEle) {
          throw new Error('element not found')
        }
        const downloadPath = await NTQQFileApi.downloadMedia(msgId, msg.chatType, msg.peerUid, findEle.elementId, '', '')
        const fileSize = findEle?.videoElement?.fileSize || findEle?.fileElement?.fileSize || findEle?.pttElement?.fileSize || '0'
        const fileName = findEle?.videoElement?.fileName || findEle?.fileElement?.fileName || findEle?.pttElement?.fileName || ''
        const res: GetFileResponse = {
          file: downloadPath,
          url: downloadPath,
          file_size: fileSize,
          file_name: fileName,
        }
        if (enableLocalFile2Url) {
          try {
            res.base64 = await fsPromise.readFile(downloadPath, 'base64')
          } catch (e) {
            throw new Error('文件下载失败. ' + e)
          }
        }
        //不手动删除？文件持久化了
        return res
      }
    } catch {

    }

    const NTSearchNameResult = (await NTQQFileApi.searchfile([payload.file])).resultItems
    if (NTSearchNameResult.length !== 0) {
      const MsgId = NTSearchNameResult[0].msgId
      let peer: Peer | undefined = undefined
      if (NTSearchNameResult[0].chatType == ChatType.group) {
        peer = { chatType: ChatType.group, peerUid: NTSearchNameResult[0].groupChatInfo[0].groupCode }
      }
      if (!peer) {
        throw new Error('chattype not support')
      }
      const msgList: RawMessage[] = (await NTQQMsgApi.getMsgsByMsgId(peer, [MsgId]))?.msgList
      if (!msgList || msgList.length == 0) {
        throw new Error('msg not found')
      }
      const msg = msgList[0]
      const file = msg.elements.filter(e => e.elementType == NTSearchNameResult[0].elemType)
      if (file.length == 0) {
        throw new Error('file not found')
      }
      const downloadPath = await NTQQFileApi.downloadMedia(msg.msgId, msg.chatType, msg.peerUid, file[0].elementId, '', '')
      const res: GetFileResponse = {
        file: downloadPath,
        url: downloadPath,
        file_size: NTSearchNameResult[0].fileSize.toString(),
        file_name: NTSearchNameResult[0].fileName,
      }
      if (enableLocalFile2Url) {
        try {
          res.base64 = await fsPromise.readFile(downloadPath, 'base64')
        } catch (e) {
          throw new Error('文件下载失败. ' + e)
        }
      }
      //不手动删除？文件持久化了
      return res
    }
    throw new Error('file not found')
  }
}

export default class GetFile extends GetFileBase {
  actionName = ActionName.GetFile

  protected async _handle(payload: { file_id: string; file: string }): Promise<GetFileResponse> {
    if (!payload.file_id) {
      throw new Error('file_id 不能为空')
    }
    payload.file = payload.file_id
    return super._handle(payload)
  }
}
