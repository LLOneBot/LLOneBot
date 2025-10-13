import { IncomingMessage, IncomingSegment, IncomingForwardedMessage } from '@saltify/milky-types';
import { transformFriend, transformGroup, transformGroupMember } from '@/milky/transform/entity';
import { RawMessage, ElementType, AtType } from '@/ntqqapi/types';
import { SimpleInfo, CategoryFriend, GroupMember, Group } from '@/ntqqapi/types';

export function transformIncomingPrivateMessage(
    friend: SimpleInfo,
    category: CategoryFriend,
    message: RawMessage,
): IncomingMessage {
    return {
        message_scene: 'friend',
        peer_id: parseInt(message.peerUin),
        message_seq: parseInt(message.msgSeq),
        segments: transformIncomingSegments(message),
        time: parseInt(message.msgTime),
        sender_id: parseInt(message.senderUin || message.peerUin),
        friend: transformFriend(friend, category),
    };
}

export function transformIncomingGroupMessage(
    group: Group,
    member: GroupMember,
    message: RawMessage,
): IncomingMessage {
    return {
        message_scene: 'group',
        peer_id: parseInt(message.peerUin),
        message_seq: parseInt(message.msgSeq),
        segments: transformIncomingSegments(message),
        time: parseInt(message.msgTime),
        sender_id: parseInt(message.senderUin || '0'),
        group: transformGroup(group),
        group_member: transformGroupMember(member),
    };
}

export function transformIncomingSegments(message: RawMessage): IncomingSegment[] {
    const segments: IncomingSegment[] = [];

    for (const element of message.elements) {
        switch (element.elementType) {
            case ElementType.Text:
                if (element.textElement.atType === AtType.All) {
                    segments.push({
                        type: 'mention_all',
                        data: {} as Record<string, never>,
                    });
                } else if (element.textElement.atType === AtType.One) {
                    segments.push({
                        type: 'mention',
                        data: {
                            user_id: parseInt(element.textElement.atUid || element.textElement.atNtUid || '0'),
                        },
                    });
                } else if (element.textElement.content) {
                    segments.push({
                        type: 'text',
                        data: {
                            text: element.textElement.content,
                        },
                    });
                }
                break;

            case ElementType.Pic:
                segments.push({
                    type: 'image',
                    data: {
                        resource_id: element.picElement.fileUuid,
                        width: element.picElement.picWidth,
                        height: element.picElement.picHeight,
                        temp_url: element.picElement.sourcePath,
                        summary: element.picElement.summary || '',
                        sub_type: element.picElement.picSubType === 1 ? 'sticker' : 'normal',
                    },
                });
                break;

            case ElementType.Face:
                segments.push({
                    type: 'face',
                    data: {
                        face_id: element.faceElement.faceIndex.toString(),
                    },
                });
                break;

            case ElementType.Reply:
                segments.push({
                    type: 'reply',
                    data: {
                        message_seq: parseInt(element.replyElement.replayMsgSeq),
                    },
                });
                break;

            case ElementType.Ptt:
                segments.push({
                    type: 'record',
                    data: {
                        resource_id: element.pttElement.fileUuid,
                        temp_url: element.pttElement.filePath,
                        duration: element.pttElement.duration,
                    },
                });
                break;

            case ElementType.Video:
                segments.push({
                    type: 'video',
                    data: {
                        resource_id: element.videoElement.fileUuid,
                        width: element.videoElement.videoMd5 ? 0 : element.videoElement.thumbWidth || 0,
                        height: element.videoElement.videoMd5 ? 0 : element.videoElement.thumbHeight || 0,
                        duration: element.videoElement.videoMd5 ? 0 : parseInt(element.videoElement.fileDuration || '0'),
                        temp_url: element.videoElement.filePath,
                    },
                });
                break;

            case ElementType.Ark:
                segments.push({
                    type: 'light_app',
                    data: {
                        app_name: 'ark',
                        json_payload: JSON.stringify(element.arkElement),
                    },
                });
                break;
        }
    }

    return segments;
}

export function transformIncomingForwardedMessage(message: any): IncomingForwardedMessage {
    // This would need to be implemented based on NTQQ's forward message structure
    return {
        sender_name: message.senderName || 'Unknown',
        avatar_url: '',
        time: message.time || Date.now(),
        segments: [],
    };
}

