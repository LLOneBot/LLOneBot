import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'
import { MessageUnique } from '@/common/utils/messageUnique'

interface Payload {
  message_id: number | string
}

export class MarkMsgAsRead extends BaseAction<Payload, null> {
  actionName = ActionName.GoCQHTTP_MarkMsgAsRead
  payloadSchema = Schema.object({
    message_id: Schema.union([Number, String]).required()
  })

  protected async _handle(payload: Payload) {
    const msg = await MessageUnique.getMsgIdAndPeerByShortId(+payload.message_id)
    if (!msg) {
      throw new Error('msg not found')
    }
    await this.ctx.ntMsgApi.setMsgRead(msg.Peer)
    return null
  }
}
