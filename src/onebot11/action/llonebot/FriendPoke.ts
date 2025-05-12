import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  user_id: number | string
}

export class FriendPoke extends BaseAction<Payload, null> {
  actionName = ActionName.FriendPoke
  payloadSchema = Schema.object({
    user_id: Schema.union([Number, String]).required()
  })

  async _handle(payload: Payload) {
    try {
      await this.ctx.app.pmhq.sendFriendPoke(+payload.user_id)
      return null
    }catch (e) {
      this.ctx.logger.error('pmhq 发包失败', e)
    }
    if (!this.ctx.app.crychic.checkPlatform() || !this.ctx.app.crychic.checkVersion()) {
      // await this.ctx.app.packet.sendPokePacket(+payload.user_id)
      throw new Error('请配置发包器，参考https://llonebot.com/zh-CN/guide/pmhq')
    }
    else {
      await this.ctx.app.crychic.sendFriendPoke(+payload.user_id)
    }
    return null
  }
}
