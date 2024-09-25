import { Friend, FriendV2, SimpleInfo, CategoryFriend, BuddyListReqType } from '../types'
import { ReceiveCmdS } from '../hook'
import { invoke, NTMethod, NTClass } from '../ntcall'
import { getSession } from '@/ntqqapi/wrapper'
import { Dict, pick } from 'cosmokit'
import { Service, Context } from 'cordis'

declare module 'cordis' {
  interface Context {
    ntFriendApi: NTQQFriendApi
  }
}

export class NTQQFriendApi extends Service {
  constructor(protected ctx: Context) {
    super(ctx, 'ntFriendApi', true)
  }

  /** 大于或等于 26702 应使用 getBuddyV2 */
  async getFriends() {
    const data = await invoke<{
      data: {
        categoryId: number
        categroyName: string
        categroyMbCount: number
        buddyList: Friend[]
      }[]
    }>(
      'getBuddyList',
      [],
      {
        className: NTClass.NODE_STORE_API,
        cbCmd: ReceiveCmdS.FRIENDS,
        afterFirstCmd: false,
      }
    )
    const _friends: Friend[] = []
    for (const item of data.data) {
      _friends.push(...item.buddyList)
    }
    return _friends
  }

  async handleFriendRequest(friendUid: string, reqTime: string, accept: boolean) {
    const session = getSession()
    if (session) {
      return session.getBuddyService().approvalFriendRequest({
        friendUid,
        reqTime,
        accept
      })
    } else {
      return await invoke(NTMethod.HANDLE_FRIEND_REQUEST, [{
        approvalInfo: {
          friendUid,
          reqTime,
          accept,
        },
      }])
    }
  }

  async getBuddyV2(refresh = false): Promise<FriendV2[]> {
    const data = await invoke<{
      buddyCategory: CategoryFriend[]
      userSimpleInfos: Record<string, SimpleInfo>
    }>(
      'getBuddyList',
      [refresh],
      {
        className: NTClass.NODE_STORE_API,
        cbCmd: ReceiveCmdS.FRIENDS,
        afterFirstCmd: false,
      }
    )
    const uids = data.buddyCategory.flatMap(item => item.buddyUids)
    return Object.values(data.userSimpleInfos).filter(v => uids.includes(v.uid!))
  }

  /** uid => uin */
  async getBuddyIdMap(refresh = false): Promise<Map<string, string>> {
    const retMap: Map<string, string> = new Map()
    const data = await invoke<{
      buddyCategory: CategoryFriend[]
      userSimpleInfos: Record<string, SimpleInfo>
    }>(
      'getBuddyList',
      [refresh],
      {
        className: NTClass.NODE_STORE_API,
        cbCmd: ReceiveCmdS.FRIENDS,
        afterFirstCmd: false,
      }
    )
    for (const item of Object.values(data.userSimpleInfos)) {
      if (retMap.size > 5000) {
        break
      }
      retMap.set(item.uid!, item.uin!)
    }
    return retMap
  }

  async getBuddyV2WithCate(refresh = false) {
    const data = await invoke<{
      buddyCategory: CategoryFriend[]
      userSimpleInfos: Record<string, SimpleInfo>
    }>(
      'getBuddyList',
      [refresh],
      {
        className: NTClass.NODE_STORE_API,
        cbCmd: ReceiveCmdS.FRIENDS,
        afterFirstCmd: false,
      }
    )
    return data
  }

  async isBuddy(uid: string): Promise<boolean> {
    const session = getSession()
    if (session) {
      return session.getBuddyService().isBuddy(uid)
    } else {
      return await invoke('nodeIKernelBuddyService/isBuddy', [{ uid }, null])
    }
  }

  async getBuddyRecommendContact(uin: string) {
    const ret = await invoke('nodeIKernelBuddyService/getBuddyRecommendContactArkJson', [{ uin }, null])
    return ret.arkMsg
  }

  async setBuddyRemark(uid: string, remark: string) {
    return await invoke('nodeIKernelBuddyService/setBuddyRemark', [{
      remarkParams: { uid, remark }
    }, null])
  }
}
