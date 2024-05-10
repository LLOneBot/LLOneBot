import { OB11Group } from '../../types'
import { OB11Constructor } from '../../constructor'
import { groups } from '../../../common/data'
import BaseAction from '../BaseAction'
import { ActionName } from '../types'
import { NTQQGroupApi } from '../../../ntqqapi/api'
import { log } from '../../../common/utils'

interface Payload {
  no_cache: boolean | string
}

class GetGroupList extends BaseAction<Payload, OB11Group[]> {
  actionName = ActionName.GetGroupList

  protected async _handle(payload: Payload) {
    if (groups.length === 0 || payload?.no_cache === true || payload?.no_cache === 'true') {
      try {
        const groups = await NTQQGroupApi.getGroups(true)
        log('强制刷新群列表, 数量:', groups.length)
        return OB11Constructor.groups(groups)
      } catch (e) {}
    }
    return OB11Constructor.groups(groups)
  }
}

export default GetGroupList
