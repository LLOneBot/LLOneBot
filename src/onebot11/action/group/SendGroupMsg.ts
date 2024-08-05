import SendMsg from '../msg/SendMsg'
import { ActionName, BaseCheckResult } from '../types'
import { OB11PostSendMsg } from '../../types'

class SendGroupMsg extends SendMsg {
  actionName = ActionName.SendGroupMsg

  protected async check(payload: OB11PostSendMsg): Promise<BaseCheckResult> {
    delete (payload as Partial<OB11PostSendMsg>).user_id
    payload.message_type = 'group'
    return super.check(payload)
  }
}

export default SendGroupMsg
