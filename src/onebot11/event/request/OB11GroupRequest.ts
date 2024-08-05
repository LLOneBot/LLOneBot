import { OB11BaseNoticeEvent } from '../notice/OB11BaseNoticeEvent'
import { EventType } from '../OB11BaseEvent'

export class OB11GroupRequestEvent extends OB11BaseNoticeEvent {
  post_type = EventType.REQUEST
  request_type: 'group'
  sub_type: 'add' | 'invite'
  invitor_id: number | undefined
  comment?: string
  flag: string
  group_id: number
  user_id: number

  constructor(groupId: number, userId: number, flag: string, comment?: string, invitorId?: number, subType: 'add' | 'invite' = 'add', requestType: 'group' = 'group') {
    super()
    this.group_id = groupId
    this.user_id = userId
    this.comment = comment
    this.flag = flag
    this.request_type = requestType
    this.sub_type = subType
    this.invitor_id = invitorId
  }
}
