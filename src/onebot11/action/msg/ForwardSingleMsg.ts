import { BaseAction } from '../BaseAction'
import { ActionName } from '../types'
import { createPeer } from '@/onebot11/helper/createMessage'

interface Payload {
  message_id: number | string
  group_id: number | string
  user_id?: number | string
}

abstract class ForwardSingleMsg extends BaseAction<Payload, null> {
  protected async _handle(payload: Payload): Promise<null> {
    if (!payload.message_id) {
      throw Error('message_id不能为空')
    }
    const msg = await this.ctx.store.getMsgInfoByShortId(+payload.message_id)
    if (!msg) {
      throw new Error(`无法找到消息${payload.message_id}`)
    }
    const peer = await createPeer(this.ctx, payload)
    const ret = await this.ctx.ntMsgApi.forwardMsg(msg.peer, peer, [msg.msgId])
    if (ret.result !== 0) {
      throw new Error(`转发消息失败 ${ret.errMsg}`)
    }
    return null
  }
}

export class ForwardFriendSingleMsg extends ForwardSingleMsg {
  actionName = ActionName.ForwardFriendSingleMsg
}

export class ForwardGroupSingleMsg extends ForwardSingleMsg {
  actionName = ActionName.ForwardGroupSingleMsg
}
