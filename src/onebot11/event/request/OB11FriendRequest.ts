import { OB11BaseNoticeEvent } from '../notice/OB11BaseNoticeEvent'
import { EventType } from '../OB11BaseEvent'

export class OB11FriendRequestEvent extends OB11BaseNoticeEvent {
  post_type = EventType.REQUEST
  user_id: number
  request_type: 'friend'
  comment: string
  flag: string

  constructor(userId: number, comment: string, flag: string, requestType: 'friend' = 'friend') {
    super()
    this.user_id = userId
    this.comment = comment
    this.flag = flag
    this.request_type = requestType
  }
}
