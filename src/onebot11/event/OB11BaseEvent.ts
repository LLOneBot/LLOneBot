import { selfInfo } from '../../common/data'

export enum EventType {
  META = 'meta_event',
  REQUEST = 'request',
  NOTICE = 'notice',
  MESSAGE = 'message',
  MESSAGE_SENT = 'message_sent',
}

export abstract class OB11BaseEvent {
  time = Math.floor(Date.now() / 1000)
  self_id = parseInt(selfInfo.uin)
  nick = selfInfo.nick
  post_type: EventType
}
