import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  group_id: number | string
  user_id: number | string
}

export class GroupPoke extends BaseAction<Payload, null> {
  actionName = ActionName.GroupPoke
  payloadSchema = Schema.object({
    group_id: Schema.union([Number, String]).required(),
    user_id: Schema.union([Number, String]).required()
  })

  async _handle(payload: Payload) {
    try{
      await this.ctx.app.pmhq.sendGroupPoke(+payload.group_id, +payload.user_id)
      return null
    }catch (e) {
      this.ctx.logger.error('pmhq 发包失败', e)
    }
    if (!this.ctx.app.crychic.checkPlatform() || !this.ctx.app.crychic.checkVersion()) {
      throw new Error('请配置发包器，参考https://llonebot.com/zh-CN/guide/pmhq')
    }
    else{
      await this.ctx.app.crychic.sendGroupPoke(+payload.group_id, +payload.user_id)
    }
    return null
  }
}
