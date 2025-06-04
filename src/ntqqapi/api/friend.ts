import { CategoryFriend, SimpleInfo } from '../types'
import { ReceiveCmdS } from '../hook'
import { invoke, NTMethod } from '../ntcall'
import { Context, Service } from 'cordis'

declare module 'cordis' {
  interface Context {
    ntFriendApi: NTQQFriendApi
  }
}

export class NTQQFriendApi extends Service {
  constructor(protected ctx: Context) {
    super(ctx, 'ntFriendApi', true)
  }

  async handleFriendRequest(friendUid: string, reqTime: string, accept: boolean) {
    return await invoke(NTMethod.HANDLE_FRIEND_REQUEST, [{
      friendUid,
      reqTime,
      accept,
    },
    ])
  }

  async getBuddyList(): Promise<SimpleInfo[]> {
    const data = await invoke<CategoryFriend[]>(
      'getBuddyList',
      [],
      {},
    )
    return data.flatMap((item: CategoryFriend) => item.buddyList)
  }

  async getBuddyV2(refresh = false): Promise<SimpleInfo[]> {
    const data = await this.getBuddyV2WithCate(refresh)
    return data.flatMap((item: CategoryFriend) => item.buddyList)
  }

  /** uid -> uin */
  async getBuddyIdMap(refresh = false): Promise<Map<string, string>> {
    const retMap: Map<string, string> = new Map()
    const data = await invoke<CategoryFriend[]>(
      'nodeIKernelBuddyService/getBuddyListV2',
      [refresh],
      {
        resultCmd: ReceiveCmdS.FRIENDS,
      },
    )
    for (const category of data) {
      if (retMap.size > 5000) {
        break
      }
      for (const buddy of category.buddyList) {
        retMap.set(buddy.uid!, buddy.uin!)
      }
    }
    return retMap
  }

  async getBuddyV2WithCate(refresh = false): Promise<CategoryFriend[]> {
    return await invoke<CategoryFriend[]>(
      'nodeIKernelBuddyService/getBuddyListV2',
      [refresh, 0],
      {
        resultCmd: ReceiveCmdS.FRIENDS,
        timeout: 3000,
      },
    )
  }

  async isBuddy(uid: string): Promise<boolean> {
    return await invoke('nodeIKernelBuddyService/isBuddy', [uid])
  }

  async getBuddyRecommendContact(uin: string) {
    const ret = await invoke('nodeIKernelBuddyService/getBuddyRecommendContactArkJson', [{ uin }])
    return ret.arkMsg
  }

  async setBuddyRemark(uid: string, remark = '') {
    return await invoke('nodeIKernelBuddyService/setBuddyRemark', [
      { uid, remark },
    ])
  }

  async delBuddy(friendUid: string) {
    return await invoke('nodeIKernelBuddyService/delBuddy', [{
      friendUid,
      tempBlock: false,
      tempBothDel: true,
    },
    ])
  }

  async setBuddyCategory(uid: string, categoryId: number) {
    return await invoke('nodeIKernelBuddyService/setBuddyCategory', [uid, categoryId])
  }
}
