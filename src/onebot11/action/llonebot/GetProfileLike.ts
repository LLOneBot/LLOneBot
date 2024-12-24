import { BaseAction, Schema } from '../BaseAction'
import { ActionName } from '../types'
import { selfInfo } from '@/common/globalVars'
import { Dict } from 'cosmokit'

interface Payload {
  start: number | string,
  count: number | string
}

interface Response {
  likeMeUsers: Dict[]
  likeUsers: Dict[]
}

export class GetProfileLike extends BaseAction<Payload, Response> {
  actionName = ActionName.GetProfileLike
  payloadSchema = Schema.object({
    start: Schema.union([Number, String]).default(0),
    count: Schema.union([Number, String]).default(20)
  })

  async _handle(payload: Payload): Promise<Response> {

    const ret = await this.ctx.ntUserApi.getProfileLike(selfInfo.uid, +payload.start, +payload.count)
    const {favoriteInfo, voteInfo} = ret.info.userLikeInfos[0]
    const likeUsers = favoriteInfo.userInfos
    const likeMeUsers = voteInfo.userInfos
    for (const item of likeMeUsers) {
      item.uin = Number(await this.ctx.ntUserApi.getUinByUid(item.uid)) || 0
    }
    for (const item of likeUsers) {
      item.uin = Number(await this.ctx.ntUserApi.getUinByUid(item.uid)) || 0
    }
    return {likeMeUsers, likeUsers}
  }
}
