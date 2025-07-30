import { OB11GroupMember } from '../../types'
import { OB11Entities } from '../../entities'
import { BaseAction } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  user_id: number | string
}

class GetUserGroupMemberInfoList extends BaseAction<Payload, OB11GroupMember[]> {
  actionName = 'get_user_group_member_info_list' as any

  protected async _handle(payload: Payload) {
    const userUin = String(payload.user_id)
    const groupList = await this.ctx.ntGroupApi.getGroups()
    const result: OB11GroupMember[] = []
    for (const group of groupList) {
      try {
        const members = await this.ctx.ntGroupApi.getGroupMembers(group.groupCode, false)
        for (const member of members.values()) {
          if (member.uin === userUin) {
            const obMember = await OB11Entities.groupMember(Number(group.groupCode), member)
            obMember.group_name = group.groupName
            result.push(obMember)
            break
          }
        }
      } catch {}
    }
    return result
  }
}

export default GetUserGroupMemberInfoList
