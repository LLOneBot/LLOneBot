import { BaseAction, Schema } from '../BaseAction'
import { GroupRequestOperateTypes } from '@/ntqqapi/types'
import { ActionName } from '../types'
import { parseBool } from '@/common/utils/misc'

interface Payload {
  flag: string
  approve: boolean
  reason?: string
}

export default class SetGroupAddRequest extends BaseAction<Payload, null> {
  actionName = ActionName.SetGroupAddRequest
  payloadSchema = Schema.object({
    flag: Schema.string().required(),
    approve: Schema.union([Boolean, Schema.transform(String, parseBool)]).default(true),
    reason: Schema.string()
  })

  protected async _handle(payload: Payload): Promise<null> {
    await this.ctx.ntGroupApi.handleGroupRequest(
      payload.flag,
      payload.approve ? GroupRequestOperateTypes.approve : GroupRequestOperateTypes.reject,
      payload.reason
    )
    return null
  }
}
