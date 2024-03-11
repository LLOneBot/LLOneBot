export type BaseCheckResult = ValidCheckResult | InvalidCheckResult

export interface ValidCheckResult {
    valid: true

    [k: string | number]: any
}

export interface InvalidCheckResult {
    valid: false
    message: string

    [k: string | number]: any
}

export enum ActionName {
    Debug = "llonebot_debug",
    SendLike = "send_like",
    GetLoginInfo = "get_login_info",
    GetFriendList = "get_friend_list",
    GetGroupInfo = "get_group_info",
    GetGroupList = "get_group_list",
    GetGroupMemberInfo = "get_group_member_info",
    GetGroupMemberList = "get_group_member_list",
    GetMsg = "get_msg",
    SendMsg = "send_msg",
    SendGroupMsg = "send_group_msg",
    SendPrivateMsg = "send_private_msg",
    DeleteMsg = "delete_msg",
    SetGroupAddRequest = "set_group_add_request",
    SetFriendAddRequest = "set_friend_add_request",
    SetGroupLeave = "set_group_leave",
    GetVersionInfo = "get_version_info",
    GetStatus = "get_status",
    CanSendRecord = "can_send_record",
    CanSendImage = "can_send_image",
    SetGroupKick = "set_group_kick",
    SetGroupBan = "set_group_ban",
    SetGroupWholeBan = "set_group_whole_ban",
    SetGroupAdmin = "set_group_admin",
    SetGroupCard = "set_group_card",
    SetGroupName = "set_group_name",
    GetImage = "get_image",
    GetRecord = "get_record",
    CleanCache = "clean_cache",
    // 以下为go-cqhttp api
    GoCQHTTP_SendGroupForwardMsg = "send_group_forward_msg",
    GoCQHTTP_SendPrivateForwardMsg = "send_private_forward_msg",
    GoCQHTTP_GetStrangerInfo = "get_stranger_info",
    GetGuildList = "get_guild_list",
    GoCQHTTP_MarkMsgAsRead = "mark_msg_as_read",
}