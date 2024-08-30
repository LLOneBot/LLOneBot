import { OB11Group } from '../../types'
import { OB11Entities } from '../../entities'
import BaseAction from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  no_cache: boolean | string
}

class GetGroupList extends BaseAction<Payload, OB11Group[]> {
  actionName = ActionName.GetGroupList

  protected async _handle(payload: Payload) {
    const groupList = await this.ctx.ntGroupApi.getGroups(payload?.no_cache === true || payload?.no_cache === 'true')
    return OB11Entities.groups(groupList)
  }
}

export default GetGroupList
