import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'
import { selfInfo } from '@/common/globalVars'

interface Payload {
  group_id: number | string
}

export class SendGroupSign extends BaseAction<Payload, null> {
  actionName = ActionName.GoCQHTTP_SendGroupSign
  payloadSchema = Schema.object({
    group_id: Schema.union([Number, String]).required(),
  })

  async _handle(payload: Payload) {
    throw new Error('暂未实现群签到功能')
    return null
  }
}
