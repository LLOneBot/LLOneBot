import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  group_id: number | string
}

interface Response {
  file_count: number
  limit_count: number
  used_space: number
  total_space: number
}

export class GetGroupFileSystemInfo extends BaseAction<Payload, Response> {
  actionName = ActionName.GoCQHTTP_GetGroupFileSystemInfo
  payloadSchema = Schema.object({
    group_id: Schema.union([Number, String]).required()
  })

  async _handle(payload: Payload) {
    const groupId = payload.group_id.toString()
    const { groupFileCounts } = await this.ctx.ntGroupApi.getGroupFileCount(groupId)
    const { groupSpaceResult } = await this.ctx.ntGroupApi.getGroupFileSpace(groupId)
    return {
      file_count: groupFileCounts[0],
      limit_count: 10000,
      used_space: +groupSpaceResult.usedSpace,
      total_space: +groupSpaceResult.totalSpace,
    }
  }
}
