import {AtType, ChatType, Group, SendMessageElement} from "../../ntqqapi/types";
import {addHistoryMsg, friends, getGroup, getHistoryMsgByShortId, getStrangerByUin, selfInfo,} from "../../common/data";
import {OB11MessageData, OB11MessageDataType, OB11MessageNode, OB11PostSendMsg} from '../types';
import {NTQQApi, Peer} from "../../ntqqapi/ntcall";
import {SendMsgElementConstructor} from "../../ntqqapi/constructor";
import {uri2local} from "../utils";
import {v4 as uuid4} from 'uuid';
import BaseAction from "./BaseAction";
import {ActionName, BaseCheckResult} from "./types";
import * as fs from "fs";
import {log, sleep} from "../../common/utils";

export interface ReturnDataType {
    message_id: number
}

class SendMsg extends BaseAction<OB11PostSendMsg, ReturnDataType> {
    actionName = ActionName.SendMsg

    protected async check(payload: OB11PostSendMsg): Promise<BaseCheckResult> {
        const messages = this.convertMessage2List(payload);
        const fmNum = this.forwardMsgNum(payload)
        if ( fmNum && fmNum != messages.length) {
            return {
                valid: false,
                message: "转发消息不能和普通消息混在一起发送,转发需要保证message只有type为node的元素"
            }
        }
        return {
            valid: true,
        }
    }

    protected async _handle(payload: OB11PostSendMsg) {
        const peer: Peer = {
            chatType: ChatType.friend,
            peerUid: ""
        }

        let group: Group | undefined = undefined;
        if (payload?.group_id) {
            group = await getGroup(payload.group_id.toString())
            if (!group) {
                throw (`群${payload.group_id}不存在`)
            }
            peer.chatType = ChatType.group
            // peer.name = group.name
            peer.peerUid = group.groupCode
        } else if (payload?.user_id) {
            const friend = friends.find(f => f.uin == payload.user_id.toString())
            if (friend) {
                // peer.name = friend.nickName
                peer.peerUid = friend.uid
            } else {
                peer.chatType = ChatType.temp
                const tempUser = getStrangerByUin(payload.user_id.toString())
                if (!tempUser) {
                    throw (`找不到私聊对象${payload.user_id}`)
                }
                // peer.name = tempUser.nickName
                peer.peerUid = tempUser.uid
            }
        }
        const messages = this.convertMessage2List(payload);
        if (this.forwardMsgNum(payload)) {
            try {
                const returnMsg = await this.handleForwardNode(peer, messages as OB11MessageNode[], group)
                return {message_id: returnMsg.msgShortId}
            } catch (e) {
                throw ("发送转发消息失败 " + e.toString())
            }
        }
        // log("send msg:", peer, sendElements)
        const {sendElements, deleteAfterSentFiles} = await this.createSendElements(messages, group)
        try {
            const returnMsg = await this.send(peer, sendElements, deleteAfterSentFiles)
            return {message_id: returnMsg.msgShortId}
        } catch (e) {
            throw (e.toString())
        }
    }

    private convertMessage2List(payload: OB11PostSendMsg) {
        if (typeof payload.message === "string") {
            payload.message = [{
                type: OB11MessageDataType.text,
                data: {
                    text: payload.message
                }
            }] as OB11MessageData[]
        } else if (!Array.isArray(payload.message)) {
            payload.message = [payload.message]
        }
        return payload.message;
    }

    private forwardMsgNum(payload: OB11PostSendMsg): number {
        if (Array.isArray(payload.message)) {
            return payload.message.filter(msg => msg.type == OB11MessageDataType.node).length
        }
        return 0
    }

    // 返回一个合并转发的消息id
    private async handleForwardNode(destPeer: Peer, messageNodes: OB11MessageNode[], group: Group | undefined) {
        const selfPeer: Peer = {
            chatType: ChatType.friend,
            peerUid: selfInfo.uid
        }
        let nodeIds: string[] = []
        for (const messageNode of messageNodes) {
            // 一个node表示一个人的消息

            let nodeId = messageNode.data.id;
            // 有nodeId表示一个子转发消息卡片
            if (nodeId) {
                nodeIds.push(nodeId)
            } else {
                // 自定义的消息
                // 提取消息段，发给自己生成消息id
                const {
                    sendElements,
                    deleteAfterSentFiles
                } = await this.createSendElements(messageNode.data.content, group)
                try {
                    const nodeMsg = await this.send(selfPeer, sendElements, deleteAfterSentFiles, true);
                    nodeIds.push(nodeMsg.msgId)
                } catch (e) {
                    log("生效转发消息节点失败")
                }
            }
        }

        // 开发转发
        try {
            return await NTQQApi.multiForwardMsg(selfPeer, destPeer, nodeIds)
        } catch (e) {
            log("forward failed", e)
            return null;
        }
    }

    private async createSendElements(messageData: OB11MessageData[], group: Group | undefined, ignoreTypes: OB11MessageDataType[] = []) {
        let sendElements: SendMessageElement[] = []
        let deleteAfterSentFiles: string[] = []
        for (let sendMsg of messageData) {
            if (ignoreTypes.includes(sendMsg.type)) {
                continue
            }
            switch (sendMsg.type) {
                case OB11MessageDataType.text: {
                    const text = sendMsg.data?.text;
                    if (text) {
                        sendElements.push(SendMsgElementConstructor.text(sendMsg.data!.text))
                    }
                }
                    break;
                case OB11MessageDataType.at: {
                    let atQQ = sendMsg.data?.qq;
                    if (atQQ) {
                        atQQ = atQQ.toString()
                        if (atQQ === "all") {
                            sendElements.push(SendMsgElementConstructor.at(atQQ, atQQ, AtType.atAll, "全体成员"))
                        } else {
                            const atMember = group?.members.find(m => m.uin == atQQ)
                            if (atMember) {
                                sendElements.push(SendMsgElementConstructor.at(atQQ, atMember.uid, AtType.atUser, atMember.cardName || atMember.nick))
                            }
                        }
                    }
                }
                    break;
                case OB11MessageDataType.reply: {
                    let replyMsgId = sendMsg.data.id;
                    if (replyMsgId) {
                        replyMsgId = replyMsgId.toString()
                        const replyMsg = getHistoryMsgByShortId(replyMsgId)
                        if (replyMsg) {
                            sendElements.push(SendMsgElementConstructor.reply(replyMsg.msgSeq, replyMsg.msgId, replyMsg.senderUin, replyMsg.senderUin))
                        }
                    }
                }
                    break;
                case OB11MessageDataType.face: {
                    const faceId = sendMsg.data?.id
                    if (faceId) {
                        sendElements.push(SendMsgElementConstructor.face(parseInt(faceId)))
                    }
                }
                    break;
                case OB11MessageDataType.image:
                case OB11MessageDataType.voice: {
                    const file = sendMsg.data?.file
                    if (file) {
                        const {path, isLocal} = (await uri2local(uuid4(), file))
                        if (path) {
                            if (!isLocal) { // 只删除http和base64转过来的文件
                                deleteAfterSentFiles.push(path)
                            }
                            if (sendMsg.type === OB11MessageDataType.image) {
                                sendElements.push(await SendMsgElementConstructor.pic(path))
                            } else {
                                sendElements.push(await SendMsgElementConstructor.ptt(path))
                            }
                        }
                    }
                }
                    break;
                // case OB11MessageDataType.node: {
                //     try {
                //         await this.handleForwardNode(peer, sendMsg, group);
                //     } catch (e) {
                //         log("forward msg crash", e.stack)
                //     }
                // }
            }

        }

        return {
            sendElements,
            deleteAfterSentFiles
        }
    }

    private async send(peer: Peer, sendElements: SendMessageElement[], deleteAfterSentFiles: string[], waitComplete=false) {
        if (!sendElements.length) {
            throw ("消息体无法解析")
        }
        const returnMsg = await NTQQApi.sendMsg(peer, sendElements, waitComplete)
        addHistoryMsg(returnMsg)
        deleteAfterSentFiles.map(f => fs.unlink(f, () => {
        }))
        return returnMsg
    }


}

export default SendMsg