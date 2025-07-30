import { OB11Group } from '../../types'
import { OB11Entities } from '../../entities'
import { BaseAction } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  user_id: number | string
}

class GetUserGroupList extends BaseAction<Payload, OB11Group[]> {
  actionName = 'get_user_group_list' as any

  protected async _handle(payload: Payload) {
    const userUin = String(payload.user_id)
    const groupList = await this.ctx.ntGroupApi.getGroups()
    const result: OB11Group[] = []
    for (const group of groupList) {
      try {
        const members = await this.ctx.ntGroupApi.getGroupMembers(group.groupCode, false)
        for (const member of members.values()) {
          if (member.uin === userUin) {
            result.push(await OB11Entities.group(group))
            break
          }
        }
      } catch {}
    }
    return result
  }
}

export default GetUserGroupList
