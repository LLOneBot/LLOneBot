import { OB11Group } from '../../types'
import { OB11Entities } from '../../entities'
import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  group_id: number | string
}

class GetGroupInfo extends BaseAction<Payload, OB11Group> {
  actionName = ActionName.GetGroupInfo
  payloadSchema = Schema.object({
    group_id: Schema.union([Number, String]).required()
  })

  protected async _handle(payload: Payload) {
    const groupCode = payload.group_id.toString()
    let group = (await this.ctx.ntGroupApi.getGroups()).find(e => e.groupCode === groupCode)
    if (group) {
      try{
        const groupAllInfo = await this.ctx.ntGroupApi.getGroupAllInfo(groupCode)
        this.ctx.logger.info(groupAllInfo)
        return {...OB11Entities.group(group), ...groupAllInfo}
      }
      catch (e) {
        this.ctx.logger.error('获取群完整详细信息失败', e)
      }
      return OB11Entities.group(group)
    }
    throw new Error(`群${payload.group_id}不存在`)
  }
}

export default GetGroupInfo
