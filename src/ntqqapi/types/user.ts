export enum Sex {
    male = 0,
    female = 2,
    unknown = 255,
}

export interface QQLevel {
    "crownNum": number,
    "sunNum": number,
    "moonNum": number,
    "starNum": number
}
export interface User {
    uid: string; // 加密的字符串
    uin: string; // QQ号
    nick: string;
    avatarUrl?: string;
    longNick?: string; // 签名
    remark?: string;
    sex?: Sex;
    "qqLevel"?: QQLevel
}

export interface SelfInfo extends User {
    online?: boolean;
}

export interface Friend extends User {}