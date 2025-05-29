import { User, List } from '@satorijs/protocol'
import { Handler } from '../index'
import { decodeUser } from '../../utils'

interface Payload {
  next?: string
}

export const getFriendList: Handler<List<User>, Payload> = async (ctx) => {
  const friends = await ctx.ntFriendApi.getBuddyV2()
  return {
    data: friends.map(e => decodeUser(e.coreInfo))
  }

}
