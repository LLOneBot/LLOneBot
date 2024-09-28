import { QQLevel, Sex } from './user'

export enum GroupListUpdateType {
  REFRESHALL,
  GETALL,
  MODIFIED,
  REMOVE
}

export interface Group {
  groupCode: string
  maxMember: number
  memberCount: number
  groupName: string
  groupStatus: 0
  memberRole: 2
  isTop: boolean
  toppedTimestamp: '0'
  privilegeFlag: number //65760
  isConf: boolean
  hasModifyConfGroupFace: boolean
  hasModifyConfGroupName: boolean
  remarkName: string
  hasMemo: boolean
  groupShutupExpireTime: string
  personShutupExpireTime: string
  discussToGroupUin: string
  discussToGroupMaxMsgSeq: number
  discussToGroupTime: number
  groupFlagExt: number //1073938496,
  authGroupType: number //0,
  groupCreditLevel: number //0,
  groupFlagExt3: number //0,
  groupOwnerId: {
    memberUin: string
    memberUid: string
  }
  members: GroupMember[] // 原始数据是没有这个的，为了方便自己加了这个字段
  createTime: string
}

export enum GroupMemberRole {
  normal = 2,
  admin = 3,
  owner = 4,
}

export interface GroupMember {
  memberSpecialTitle?: string
  avatarPath: string
  cardName: string
  cardType: number
  isDelete: boolean
  nick: string
  qid: string
  remark: string
  role: GroupMemberRole // 群主:4, 管理员:3，群员:2
  shutUpTime: number // 禁言时间，单位是什么暂时不清楚
  uid: string // 加密的字符串
  uin: string // QQ号
  isRobot: boolean
  sex?: Sex
  qqLevel?: QQLevel
  isChangeRole: boolean
  joinTime: number
  lastSpeakTime: number
  memberLevel: number
}

export interface PublishGroupBulletinReq {
  text: string
  picInfo?: {
    id: string
    width: number
    height: number
  }
  oldFeedsId: ''
  pinned: number
  confirmRequired: number
}

export interface GroupAllInfo {
  groupCode: string
  ownerUid: string
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
  shutUpAllTimestamp: number
  shutUpMeTimestamp: number //解除禁言时间
  groupTypeFlag: number
  privilegeFlag: number
  groupSecLevel: number
  groupFlagExt3: number
  isConfGroup: number
  isModifyConfGroupFace: number
  isModifyConfGroupName: number
  noFigerOpenFlag: number
  noCodeFingerOpenFlag: number
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
  remarkName: number
  isTop: boolean
  richFingerMemo: string
  groupAnswer: string
  joinGroupAuth: string
  isAllowModifyConfGroupName: number
}

export interface GroupBulletinListResult {
  groupCode: string
  srvCode: number
  readOnly: number
  role: number
  inst: unknown[]
  feeds: {
    uin: string
    feedId: string
    publishTime: string
    msg: {
      text: string
      textFace: string
      pics: {
        id: string
        width: number
        height: number
      }[]
      title: string
    }
    type: number
    fn: number
    cn: number
    vn: number
    settings: {
      isShowEditCard: number
      remindTs: number
      tipWindowType: number
      confirmRequired: number
    }
    pinned: number
    readNum: number
    is_read: number
    is_all_confirm: number
  }[]
  groupInfo: {
    groupCode: string
    classId: number
  }
  gln: number
  tst: number
  publisherInfos: {
    uin: string
    nick: string
    avatar: string
  }[]
  server_time: string
  svrt: string
  nextIndex: number
  jointime: string
}
