import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  group_id: number | string
  user_ids: Array<number | string>
}

export class BatchDeleteGroupMember extends BaseAction<Payload, null> {
  actionName = ActionName.BatchDeleteGroupMember
  payloadSchema = Schema.object({
    group_id: Schema.union([Number, String]).required(),
    user_ids: Schema.array(Schema.union([Number, String])).required(),
  })

  protected async _handle(payload: Payload): Promise<null> {
    const groupCode = payload.group_id.toString()
    const memberUinList = payload.user_ids.map(id => id.toString())

    // 使用 WebAPI 进行批量删除
    return await this.ctx.ntWebApi.batchDeleteGroupMember(groupCode, memberUinList)
  }
}
