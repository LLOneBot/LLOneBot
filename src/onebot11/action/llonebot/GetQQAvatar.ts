import { BaseAction } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  user_id: string
}

export class GetQQAvatar extends BaseAction<Payload, string> {
  actionName = ActionName.GetQQAvatar

  protected async _handle(payload: Payload){
    return `https://thirdqq.qlogo.cn/g?b=qq&nk=${payload.user_id}&s=640`
  }
}
