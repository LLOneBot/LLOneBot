import { BaseAction, Schema } from '../BaseAction'
import { OB11Message } from '@/onebot11/types'
import { ActionName } from '../types'
import { ChatType, RawMessage } from '@/ntqqapi/types'
import { OB11Entities } from '@/onebot11/entities'
import { filterNullable, parseBool } from '@/common/utils/misc'

interface Payload {
  user_id: number | string
  message_seq?: number | string
  count: number | string
  reverseOrder: boolean
}

interface Response {
  messages: OB11Message[]
}

export class GetFriendMsgHistory extends BaseAction<Payload, Response> {
  actionName = ActionName.GetFriendMsgHistory
  payloadSchema = Schema.object({
    user_id: Schema.union([Number, String]).required(),
    message_seq: Schema.union([Number, String]),
    count: Schema.union([Number, String]).default(20),
    reverseOrder: Schema.union([Boolean, Schema.transform(String, parseBool)]).default(false)
  })

  async _handle(payload: Payload): Promise<Response> {
    const { count, reverseOrder } = payload
    const uid = await this.ctx.ntUserApi.getUidByUin(payload.user_id.toString())
    if (!uid) throw new Error(`无法获取用户信息`)
    const isBuddy = await this.ctx.ntFriendApi.isBuddy(uid)
    const peer = { chatType: isBuddy ? ChatType.C2C : ChatType.TempC2CFromGroup, peerUid: uid }

    let msgList: RawMessage[]
    if (!payload.message_seq || +payload.message_seq === 0) {
      msgList = (await this.ctx.ntMsgApi.getAioFirstViewLatestMsgs(peer, +count)).msgList
    } else {
      msgList = (await this.ctx.ntMsgApi.getMsgsBySeqAndCount(peer, String(payload.message_seq), +count, true, true)).msgList
    }

    if (!msgList?.length) throw new Error('未找到消息')
    if (reverseOrder) msgList.reverse()
    const ob11MsgList = await Promise.all(msgList.map(msg => OB11Entities.message(this.ctx, msg)))
    return { messages: filterNullable(ob11MsgList) }
  }
}
