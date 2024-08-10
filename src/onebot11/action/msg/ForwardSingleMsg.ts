import BaseAction from '../BaseAction'
import { NTQQMsgApi, NTQQUserApi } from '@/ntqqapi/api'
import { ChatType } from '@/ntqqapi/types'
import { dbUtil } from '@/common/db'
import { ActionName } from '../types'
import { Peer } from '@/ntqqapi/types'

interface Payload {
  message_id: number
  group_id: number | string
  user_id?: number | string
}

interface Response {
  message_id: number
}

abstract class ForwardSingleMsg extends BaseAction<Payload, Response> {
  protected async getTargetPeer(payload: Payload): Promise<Peer> {
    if (payload.user_id) {
      const peerUid = await NTQQUserApi.getUidByUin(payload.user_id.toString())
      if (!peerUid) {
        throw new Error(`无法找到私聊对象${payload.user_id}`)
      }
      return { chatType: ChatType.friend, peerUid }
    }
    return { chatType: ChatType.group, peerUid: payload.group_id!.toString() }
  }

  protected async _handle(payload: Payload): Promise<Response> {
    const msg = await dbUtil.getMsgByShortId(payload.message_id)
    if (!msg) {
      throw new Error(`无法找到消息${payload.message_id}`)
    }
    const peer = await this.getTargetPeer(payload)
    const sentMsg = await NTQQMsgApi.forwardMsg(
      {
        chatType: msg.chatType,
        peerUid: msg.peerUid,
      },
      peer,
      [msg.msgId],
    )
    const ob11MsgId = await dbUtil.addMsg(sentMsg)
    return { message_id: ob11MsgId! }
  }
}

export class ForwardFriendSingleMsg extends ForwardSingleMsg {
  actionName = ActionName.ForwardFriendSingleMsg
}

export class ForwardGroupSingleMsg extends ForwardSingleMsg {
  actionName = ActionName.ForwardGroupSingleMsg
}
