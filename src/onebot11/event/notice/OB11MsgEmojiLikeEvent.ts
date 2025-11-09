import { OB11GroupNoticeEvent } from './OB11GroupNoticeEvent'

interface MsgEmojiLike {
  emoji_id: string
  count: number
}

export class OB11GroupMsgEmojiLikeEvent extends OB11GroupNoticeEvent {
  notice_type = 'group_msg_emoji_like'
  message_id: number
  likes: MsgEmojiLike[]
  group_id: number
  user_id: number
  is_add: boolean

  constructor(groupId: number, userId: number, messageId: number, likes: MsgEmojiLike[], isAdd: boolean) {
    super()
    this.group_id = groupId
    this.user_id = userId // 可为空，表示是对别人的消息操作，如果是对bot自己的消息则不为空
    this.message_id = messageId
    this.likes = likes
    this.is_add = isAdd
  }
}
