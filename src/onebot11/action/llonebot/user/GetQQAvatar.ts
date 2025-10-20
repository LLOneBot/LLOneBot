import { BaseAction } from '../../BaseAction'
import { ActionName } from '../../types'

interface Payload {
  user_id: string
}

interface Response {
  url: string
}

export class GetQQAvatar extends BaseAction<Payload, Response> {
  actionName = ActionName.GetQQAvatar

  protected async _handle(payload: Payload) {
    return { url: `https://thirdqq.qlogo.cn/g?b=qq&nk=${payload.user_id}&s=640` }
  }
}
