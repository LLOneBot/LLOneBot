import { OB11User } from '../../types'
import { OB11Constructor } from '../../constructor'
import { friends } from '../../../common/data'
import BaseAction from '../BaseAction'
import { ActionName } from '../types'
import { NTQQFriendApi } from '../../../ntqqapi/api'
import { log } from '../../../common/utils'

interface Payload{
  no_cache: boolean | string
}

class GetFriendList extends BaseAction<Payload, OB11User[]> {
  actionName = ActionName.GetFriendList

  protected async _handle(payload: Payload) {
    if (friends.length === 0 || payload?.no_cache === true || payload?.no_cache === 'true') {
      const _friends = await NTQQFriendApi.getFriends(true)
      // log('强制刷新好友列表，结果: ', _friends)
      if (_friends.length > 0) {
        friends.length = 0
        friends.push(..._friends)
      }
    }
    return OB11Constructor.friends(friends)
  }
}

export default GetFriendList
