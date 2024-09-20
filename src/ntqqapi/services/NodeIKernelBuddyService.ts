import { GeneralCallResult } from './common'

export enum BuddyListReqType {
  KNOMAL,
  KLETTER
}

export interface NodeIKernelBuddyService {
  getBuddyListV2(callFrom: string, reqType: BuddyListReqType): Promise<GeneralCallResult & {
    data: {
      categoryId: number  //9999疑似兜底数据
      categorySortId: number
      categroyName: string
      categroyMbCount: number
      onlineCount: number
      buddyUids: string[]
    }[]
  }>

  setBuddyRemark(uid: number, remark: string): void

  isBuddy(uid: string): boolean

  approvalFriendRequest(arg: {
    friendUid: string
    reqTime: string
    accept: boolean
  }): Promise<void>

  getBuddyRecommendContactArkJson(uid: string, phoneNumber: string): Promise<GeneralCallResult & { arkMsg: string }>
}
