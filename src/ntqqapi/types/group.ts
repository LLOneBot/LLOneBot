import {QQLevel, Sex} from "./user";

export interface Group {
    groupCode: string,
    maxMember: number,
    memberCount: number,
    groupName: string,
    groupStatus: 0,
    memberRole: 2,
    isTop: boolean,
    toppedTimestamp: "0",
    privilegeFlag: number, //65760
    isConf: boolean,
    hasModifyConfGroupFace: boolean,
    hasModifyConfGroupName: boolean,
    remarkName: string,
    hasMemo: boolean,
    groupShutupExpireTime: string, //"0",
    personShutupExpireTime: string, //"0",
    discussToGroupUin: string, //"0",
    discussToGroupMaxMsgSeq: number,
    discussToGroupTime: number,
    groupFlagExt: number, //1073938496,
    authGroupType: number, //0,
    groupCreditLevel: number, //0,
    groupFlagExt3: number, //0,
    groupOwnerId: {
        "memberUin": string, //"0",
        "memberUid": string, //"u_fbf8N7aeuZEnUiJAbQ9R8Q"
    },
    members: GroupMember[]  // 原始数据是没有这个的，为了方便自己加了这个字段
}

export enum GroupMemberRole {
    normal = 2,
    admin = 3,
    owner = 4
}

export interface GroupMember {
    avatarPath: string;
    cardName: string;
    cardType: number;
    isDelete: boolean;
    nick: string;
    qid: string;
    remark: string;
    role: GroupMemberRole; // 群主:4, 管理员:3，群员:2
    shutUpTime: number; // 禁言时间，单位是什么暂时不清楚
    uid: string; // 加密的字符串
    uin: string; // QQ号
    isRobot: boolean;
    sex?: Sex
    qqLevel?: QQLevel
}