import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  user_id: number | string
}

export class DeleteFriend extends BaseAction<Payload, null> {
  actionName = ActionName.GoCQHTTP_DeleteFriend
  payloadSchema = Schema.object({
    user_id: Schema.union([Number, String]).required()
  })

  protected async _handle(payload: Payload) {
    const uin = payload.user_id.toString()
    const uid = await this.ctx.ntUserApi.getUidByUin(uin)
    if (!uid) throw new Error('无法获取用户信息')
    await this.ctx.ntFriendApi.delBuddy(uid)
    return null
  }
}
