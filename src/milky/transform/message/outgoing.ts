import { resolveMilkyUri } from '@/milky/common/download';
import type { Context } from 'cordis';
import { OutgoingSegment, OutgoingForwardedMessage } from '@saltify/milky-types';
import { SendMessageElement, ElementType } from '@/ntqqapi/types';
import { SendElement } from '@/ntqqapi/entities';
import { TEMP_DIR } from '@/common/globalVars';
import { writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

export async function transformOutgoingMessage(
    ctx: Context,
    segments: OutgoingSegment[],
    peerUid: string,
    isGroup: boolean = false,
): Promise<SendMessageElement[]> {
    const elements: SendMessageElement[] = [];

    for (const segment of segments) {
        try {
            if (segment.type === 'text') {
                elements.push(SendElement.text(segment.data.text));
            } else if (segment.type === 'face') {
                elements.push(SendElement.face(parseInt(segment.data.face_id)));
            } else if (segment.type === 'mention' && isGroup) {
                // Get member info for @mention
                const memberUin = segment.data.user_id.toString();
                elements.push(SendElement.at(memberUin, '', 1, `@${memberUin}`));
            } else if (segment.type === 'mention_all' && isGroup) {
                elements.push(SendElement.at('', '', 2, '@全体成员'));
            } else if (segment.type === 'reply') {
                // Need to fetch the message being replied to
                const replyMsgSeq = segment.data.message_seq.toString();
                // This is simplified - in production we'd need to fetch the actual message
                elements.push(SendElement.reply(replyMsgSeq, '', peerUid));
            } else if (segment.type === 'image') {
                const imageBuffer = await resolveMilkyUri(segment.data.uri);
                // Save to temp file and upload
                const tempPath = path.join(TEMP_DIR, `image-${randomUUID()}`);
                await writeFile(tempPath, imageBuffer);
                const subType = segment.data.sub_type === 'sticker' ? 1 : 0;
                const picElement = await SendElement.pic(ctx, tempPath, segment.data.summary || '', subType);
                elements.push(picElement);
            } else if (segment.type === 'record') {
                const recordBuffer = await resolveMilkyUri(segment.data.uri);
                const tempPath = path.join(TEMP_DIR, `audio-${randomUUID()}`);
                await writeFile(tempPath, recordBuffer);
                const pttElement = await SendElement.ptt(ctx, tempPath);
                elements.push(pttElement);
            } else if (segment.type === 'video') {
                const videoBuffer = await resolveMilkyUri(segment.data.uri);
                const tempPath = path.join(TEMP_DIR, `video-${randomUUID()}`);
                await writeFile(tempPath, videoBuffer);
                let thumbTempPath: string | undefined = undefined;
                if (segment.data.thumb_uri) {
                    const thumbBuffer = await resolveMilkyUri(segment.data.thumb_uri);
                    const thumbTempPath = path.join(TEMP_DIR, `thumb-${randomUUID()}`);
                    await writeFile(thumbTempPath, thumbBuffer);
                }
                const videoElement = await SendElement.video(ctx, tempPath, thumbTempPath);
                elements.push(videoElement);
            }
        } catch (error) {
            ctx.logger.error('MilkyTransform', `Failed to transform segment ${segment.type}: ${error}`);
        }
    }

    return elements;
}

export async function transformOutgoingForwardMessages(
    ctx: Context,
    messages: OutgoingForwardedMessage[]
): Promise<any[]> {
    // This would need proper implementation for forward messages
    const result = [];
    for (const msg of messages) {
        result.push({
            senderUin: msg.user_id.toString(),
            senderName: msg.sender_name,
            time: Date.now(),
            segments: await transformOutgoingMessage(ctx, msg.segments as OutgoingSegment[], '', false),
        });
    }
    return result;
}

