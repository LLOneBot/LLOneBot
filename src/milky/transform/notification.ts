import { FriendRequest, GroupNotification } from '@saltify/milky-types';

export function transformFriendRequest(r: any): FriendRequest {
    return {
        time: r.reqTime || Date.now(),
        initiator_id: parseInt(r.friendUin),
        initiator_uid: r.friendUid,
        target_user_id: parseInt(r.targetUin || '0'),
        target_user_uid: r.targetUid || '',
        state: 'pending',
        comment: r.extWords || '',
        via: r.sourceId ? `来源:${r.sourceId}` : '',
        is_filtered: false,
    };
}

export function transformGroupNotification(n: any): GroupNotification {
    // This would need to be adapted based on NTQQ's group notification structure
    // For now, provide a basic structure
    if (n.type === 1) { // Join request
        return {
            type: 'join_request',
            group_id: parseInt(n.group.groupCode),
            notification_seq: parseInt(n.seq || '0'),
            is_filtered: false,
            initiator_id: parseInt(n.user1.uin),
            state: 'pending',
            operator_id: 0,
            comment: n.postscript || '',
        };
    }
    throw new Error(`Unknown group notification type: ${n.type}`);
}

