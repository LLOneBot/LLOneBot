import { BaseAction, Schema } from '../BaseAction'
import { OB11User } from '../../types'
import { OB11Entities } from '../../entities'
import { ActionName } from '../types'
import { calcQQLevel } from '@/common/utils/misc'

interface Payload {
  user_id: number | string
}

interface Response extends OB11User {
  reg_time: number
  long_nick: string
  city: string
  country: string
  birthday_year: number
  birthday_month: number
  birthday_day: number
}

export class GetStrangerInfo extends BaseAction<Payload, Response> {
  actionName = ActionName.GoCQHTTP_GetStrangerInfo
  payloadSchema = Schema.object({
    user_id: Schema.union([Number, String]).required()
  })

  protected async _handle(payload: Payload) {
    const uin = payload.user_id.toString()
    const data = await this.ctx.ntUserApi.getUserDetailInfoByUin(uin)
    const resp = {
      user_id: parseInt(data.detail.uin) || 0,
      nickname: data.detail.simpleInfo.coreInfo.nick,
      sex: OB11Entities.sex(data.detail.simpleInfo.baseInfo.sex),
      age: data.detail.simpleInfo.baseInfo.age,
      qid: data.detail.simpleInfo.baseInfo.qid,
      level: data.detail.commonExt?.qqLevel && calcQQLevel(data.detail.commonExt.qqLevel) || 0,
      login_days: 0,
      reg_time: data.detail.commonExt!.regTime,
      long_nick: data.detail.simpleInfo.baseInfo.longNick,
      city: data.detail.commonExt!.city,
      country: data.detail.commonExt!.country,
      birthday_year: data.detail.simpleInfo.baseInfo.birthday_year,
      birthday_month: data.detail.simpleInfo.baseInfo.birthday_month,
      birthday_day: data.detail.simpleInfo.baseInfo.birthday_day
    }
    if (resp.level === 0) {
      resp.level = await this.ctx.app.pmhq.fetchUserLevel(+payload.user_id)
    }
    return resp
  }
}
