import { SimpleInfo, ProfileBizType, UserDetailInfoV2, UserDetailSource } from '../types'
import { GeneralCallResult } from './common'

export interface NodeIKernelProfileService {
  getUidByUin(callFrom: string, uin: string[]): Promise<Map<string, string>>

  getUinByUid(callFrom: string, uid: string[]): Promise<Map<string, string>>

  getCoreAndBaseInfo(callFrom: string, uids: string[]): Promise<Map<string, SimpleInfo>>

  fetchUserDetailInfo(callFrom: string, uid: string[], source: UserDetailSource, bizList: ProfileBizType[]): Promise<GeneralCallResult & {
    source: UserDetailSource
    detail: Map<string, UserDetailInfoV2>
  }>

  setHeader(path: string): Promise<GeneralCallResult>

  getUserDetailInfoWithBizInfo(uid: string, biz: unknown[]): Promise<GeneralCallResult>

  getUserDetailInfoByUin(uin: string): Promise<GeneralCallResult & { detail: UserDetailInfoV2 }>

  modifyDesktopMiniProfile(profile: unknown): Promise<GeneralCallResult>

  getUserSimpleInfo(uids: string[], force: boolean): Promise<GeneralCallResult>
}
