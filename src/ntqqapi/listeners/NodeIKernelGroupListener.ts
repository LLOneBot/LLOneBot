import { GroupMember } from '../types'

export interface GroupGeoInfo {
  ownerUid: string
  SetTime: number
  CityId: number
  Longitude: string
  Latitude: string
  GeoContent: string
  poiId: string
}

export interface GroupCardPrefix {
  introduction: string
  rptPrefix: any[]
}

export interface GroupOwnerId {
  memberUin: string
  memberUid: string
  memberQid: string
}

export interface GroupBindGuildIds {
  guildIds: any[]
}

export interface GroupExtFlameData {
  switchState: number
  state: number
  dayNums: any[]
  version: number
  updateTime: string
  isDisplayDayNum: boolean
}

export interface GroupExcludeGuildIds {
  guildIds: any[]
}

export interface GroupExt {
  groupInfoExtSeq: number
  reserve: number
  luckyWordId: string
  lightCharNum: number
  luckyWord: string
  starId: number
  essentialMsgSwitch: number
  todoSeq: number
  blacklistExpireTime: number
  isLimitGroupRtc: number
  companyId: number
  hasGroupCustomPortrait: number
  bindGuildId: string
  groupOwnerId: GroupOwnerId
  essentialMsgPrivilege: number
  msgEventSeq: string
  inviteRobotSwitch: number
  gangUpId: string
  qqMusicMedalSwitch: number
  showPlayTogetherSwitch: number
  groupFlagPro1: string
  groupBindGuildIds: GroupBindGuildIds
  viewedMsgDisappearTime: string
  groupExtFlameData: GroupExtFlameData
  groupBindGuildSwitch: number
  groupAioBindGuildId: string
  groupExcludeGuildIds: GroupExcludeGuildIds
  fullGroupExpansionSwitch: number
  fullGroupExpansionSeq: string
  inviteRobotMemberSwitch: number
  inviteRobotMemberExamine: number
  groupSquareSwitch: number
}

export interface GroupSchoolInfo {
  location: string
  grade: number
  school: string
}

export interface GroupHeadPortrait {
  portraitCnt: number
  portraitInfo: any[]
  defaultId: number
  verifyingPortraitCnt: number
  verifyingPortraitInfo: any[]
}

export interface GroupExtOnly {
  tribeId: number
  moneyForAddGroup: number
}

export enum LocalExitGroupReason {
  NO_QUIT = 0,  // 没有退出群，正常状态
  KICKED = 1,  // 被踢出
  DISMISS = 2,  // 群解散
  SELF_QUIT = 3  // 自己主动退出
}

export interface GroupInfo {
  groupCode: string
  groupUin: string
  ownerUid: string
  ownerUin: string
  groupFlag: number
  groupFlagExt: number
  maxMemberNum: number
  memberNum: number
  groupOption: number
  classExt: number
  groupName: string
  fingerMemo: string
  groupQuestion: string
  certType: number
  richFingerMemo: string
  tagRecord: any[]
  shutUpAllTimestamp: number
  shutUpMeTimestamp: number
  groupTypeFlag: number
  privilegeFlag: number
  groupSecLevel: number
  groupFlagExt3: number
  isConfGroup: number
  isModifyConfGroupFace: number
  isModifyConfGroupName: number
  groupFlagExt4: number
  groupMemo: string
  cmdUinMsgSeq: number
  cmdUinJoinTime: number
  cmdUinUinFlag: number
  cmdUinMsgMask: number
  groupSecLevelInfo: number
  cmdUinPrivilege: number
  cmdUinFlagEx2: number
  appealDeadline: number
  remarkName: string
  isTop: boolean
  groupFace: number
  groupGeoInfo: GroupGeoInfo
  certificationText: string
  cmdUinRingtoneId: number
  longGroupName: string
  autoAgreeJoinGroupUserNumForConfGroup: number
  autoAgreeJoinGroupUserNumForNormalGroup: number
  cmdUinFlagExt3Grocery: number
  groupCardPrefix: GroupCardPrefix
  groupExt: GroupExt
  msgLimitFrequency: number
  hlGuildAppid: number
  hlGuildSubType: number
  isAllowRecallMsg: number
  confUin: string
  confMaxMsgSeq: number
  confToGroupTime: number
  groupSchoolInfo: GroupSchoolInfo
  activeMemberNum: number
  groupGrade: number
  groupCreateTime: number
  subscriptionUin: string
  subscriptionUid: string
  noFingerOpenFlag: number
  noCodeFingerOpenFlag: number
  isGroupFreeze: number
  allianceId: string
  groupExtOnly: GroupExtOnly
  isAllowConfGroupMemberModifyGroupName: number
  isAllowConfGroupMemberNick: number
  isAllowConfGroupMemberAtAll: number
  groupClassText: string
  groupFreezeReason: number
  headPortraitSeq: number
  groupHeadPortrait: GroupHeadPortrait
  cmdUinJoinMsgSeq: number
  cmdUinJoinRealMsgSeq: number
  groupAnswer: string
  groupAdminMaxNum: number
  inviteNoAuthNumLimit: string
  hlGuildOrgId: number
  isAllowHlGuildBinary: number
  localExitGroupReason: LocalExitGroupReason
}

export interface NodeIKernelGroupListener {
  onGroupDetailInfoChange(groupDetail: GroupInfo): void
}
