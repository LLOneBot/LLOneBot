import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'
import { selfInfo } from '@/common/globalVars'

interface Payload {
  nickname?: string
  personal_note?: string
}

export class SetQQProfile extends BaseAction<Payload, null> {
  actionName = ActionName.GoCQHTTP_SetQQProfile
  payloadSchema = Schema.object({
    nickname: Schema.string(),
    personal_note: Schema.string()
  })

  async _handle(payload: Payload) {
    const old = await this.ctx.ntUserApi.getUserDetailInfo(selfInfo.uid)
    await this.ctx.ntUserApi.modifySelfProfile({
      nick: payload.nickname ?? old.nick,
      longNick: payload.personal_note ?? old.longNick,
      sex: old.sex,
      birthday: {
        birthday_year: old.birthday_year,
        birthday_month: old.birthday_month,
        birthday_day: old.birthday_day,
      },
      location: {
        country: old.country,
        province: old.province,
        city: old.city,
        zone: ''
      },
    })
    return null
  }
}
