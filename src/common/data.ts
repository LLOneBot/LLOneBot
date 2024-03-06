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
import {dbUtil} from "./db";
import {raw} from "express";

export const selfInfo: SelfInfo = {
    uid: '',
    uin: '',
    nick: '',
    online: true
}
export let groups: Group[] = []
export let friends: Friend[] = []
export let groupNotifies: Map<string, GroupNotify> = new Map<string, GroupNotify>()
export let friendRequests: Map<number, FriendRequest> = new Map<number, FriendRequest>()
export const llonebotError: LLOneBotError = {
    ffmpegError: '',
    otherError: ''
}

export const fileCache = new Map<string, FileCache>()


export async function getHistoryMsgByShortId(shortId: number) {
    // log("getHistoryMsgByShortId", shortId, Object.values(msgHistory).map(m=>m.msgShortId))
    return await dbUtil.getMsgByShortId(shortId);
}

export async function getFriend(qq: string): Promise<Friend | undefined> {
    let friend = friends.find(friend => friend.uin === qq)
    if (!friend){
        friends = (await NTQQApi.getFriends(true))
        friend = friends.find(friend => friend.uin === qq)
    }
    return friend
}

export async function getGroup(qq: string): Promise<Group | undefined> {
    let group = groups.find(group => group.groupCode === qq)
    if (!group){
        const _groups = await NTQQApi.getGroups(true);
        group = _groups.find(group => group.groupCode === qq)
        if (group){
            groups.push(group)
        }
    }
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

export async function refreshGroupMembers(groupQQ: string) {
    const group = groups.find(group => group.groupCode === groupQQ)
    if (group) {
        group.members = await NTQQApi.getGroupMembers(groupQQ)
    }
}

export const uidMaps: Record<string, string> = {} // 一串加密的字符串(uid) -> qq号

export function getUidByUin(uin: string) {
    for (const key in uidMaps) {
        if (uidMaps[key] === uin) {
            return key
        }
    }
}

export let tempGroupCodeMap: Record<string, string> = {}  // peerUid => 群号