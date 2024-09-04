import BaseAction from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  group_id: number | string
  content: string
  image?: string
  pinned?: number | string //扩展
  confirm_required?: number | string //扩展
}

export class SendGroupNotice extends BaseAction<Payload, null> {
  actionName = ActionName.GoCQHTTP_SendGroupNotice

  async _handle(payload: Payload) {
    const type = 1
    const isShowEditCard = 0
    const tipWindowType = 0
    const pinned = Number(payload.pinned ?? 0)
    const confirmRequired = Number(payload.confirm_required ?? 1)

    const result = await this.ctx.ntWebApi.setGroupNotice({
      groupCode: payload.group_id.toString(),
      content: payload.content,
      pinned,
      type,
      isShowEditCard,
      tipWindowType,
      confirmRequired,
      picId: ''
    })
    if (result.ec !== 0) {
      throw new Error(`设置群公告失败, 错误信息: ${result.em}`)
    }
    return null
  }
}