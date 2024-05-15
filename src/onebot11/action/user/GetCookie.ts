import BaseAction from '../BaseAction'
import { NTQQUserApi } from '../../../ntqqapi/api'
import { groups } from '../../../common/data'
import { ActionName } from '../types'

interface Payload {
  domain: string
}

export class GetCookies extends BaseAction<Payload, { cookies: string; bkn: string }> {
  actionName = ActionName.GetCookies

  protected async _handle(payload: Payload) {
    const domain = payload.domain || 'qun.qq.com'
    return NTQQUserApi.getCookies(domain);
  }
}
