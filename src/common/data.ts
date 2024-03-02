import {NTQQApi} from '../ntqqapi/ntcall'
import {
    type Friend,
    type FriendRequest,
    type Group,
    type GroupMember,
    type GroupNotify,
    type RawMessage,
    type SelfInfo
} from '../ntqqapi/types'
import {type FileCache, type LLOneBotError} from './types'

export const selfInfo: SelfInfo = {
    uid: '',
    uin: '',
    nick: '',
    online: true
}
export const groups: Group[] = []
export const friends: Friend[] = []
export const msgHistory: Record<string, RawMessage> = {} // msgId: RawMessage
export const groupNotifies: Map<string, GroupNotify> = new Map<string, GroupNotify>()
export const friendRequests: Map<number, FriendRequest> = new Map<number, FriendRequest>()
export const llonebotError: LLOneBotError = {
    ffmpegError: '',
    otherError: ''
}
let globalMsgId = Math.floor(Date.now() / 1000)

export const fileCache = new Map<string, FileCache>()

export function addHistoryMsg(msg: RawMessage): boolean {
    const existMsg = msgHistory[msg.msgId]
    if (existMsg) {
        Object.assign(existMsg, msg)
        msg.msgShortId = existMsg.msgShortId
        return false
    }
    msg.msgShortId = ++globalMsgId
    msgHistory[msg.msgId] = msg
    return true
}

export function getHistoryMsgByShortId(shortId: number | string) {
    // log("getHistoryMsgByShortId", shortId, Object.values(msgHistory).map(m=>m.msgShortId))
    return Object.values(msgHistory).find(msg => msg.msgShortId.toString() == shortId.toString())
}

export async function getFriend(qq: string): Promise<Friend | undefined> {
    const friend = friends.find(friend => friend.uin === qq)
    // if (!friend){
    //     friends = (await NTQQApi.getFriends(true))
    //     friend = friends.find(friend => friend.uin === qq)
    // }
    return friend
}

export async function getGroup(qq: string): Promise<Group | undefined> {
    const group = groups.find(group => group.groupCode === qq)
    // if (!group){
    //     groups = await NTQQApi.getGroups(true);
    //     group = groups.find(group => group.groupCode === qq)
    // }
    return group
}

export async function getGroupMember(groupQQ: string | number, memberQQ: string | number, memberUid: string = null) {
    groupQQ = groupQQ.toString()
    if (memberQQ) {
        memberQQ = memberQQ.toString()
    }
    const group = await getGroup(groupQQ)
    if (group) {
        let filterFunc: (member: GroupMember) => boolean
        if (memberQQ) {
            filterFunc = member => member.uin === memberQQ
        } else if (memberUid) {
            filterFunc = member => member.uid === memberUid
        }
        let member = group.members?.find(filterFunc)
        if (!member) {
            const _members = await NTQQApi.getGroupMembers(groupQQ)
            if (_members.length > 0) {
                group.members = _members
            }
            member = group.members?.find(filterFunc)
        }
        return member
    }
}

export function getHistoryMsgBySeq(seq: string) {
    return Object.values(msgHistory).find(msg => msg.msgSeq === seq)
}

export const uidMaps: Record<string, string> = {} // 一串加密的字符串(uid) -> qq号

export function getUidByUin(uin: string) {
    for (const key in uidMaps) {
        if (uidMaps[key] === uin) {
            return key
        }
    }
}
