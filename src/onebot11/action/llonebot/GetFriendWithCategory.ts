import { BaseAction } from '../BaseAction'
import { OB11User } from '../../types'
import { OB11Entities } from '../../entities'
import { ActionName } from '../types'
import { getBuildVersion } from '@/common/utils'

interface Category {
  categoryId: number
  categorySortId: number
  categoryName: string
  categoryMbCount: number
  onlineCount: number
  buddyList: OB11User[]
}

export class GetFriendWithCategory extends BaseAction<void, Category[]> {
  actionName = ActionName.GetFriendsWithCategory

  protected async _handle() {
    if (getBuildVersion() < 26702) {
      throw new Error('this ntqq version not support, must be 26702 or later')
    }
    const data = await this.ctx.ntFriendApi.getBuddyV2WithCate(true)
    return data.buddyCategory.map(item => {
      return {
        categoryId: item.categoryId,
        categorySortId: item.categorySortId,
        categoryName: item.categroyName,
        categoryMbCount: item.categroyMbCount,
        onlineCount: item.onlineCount,
        buddyList: item.buddyUids.map(uid => {
          const info = data.userSimpleInfos[uid]
          return OB11Entities.friendV2(info)
        })
      }
    })
  }
}
