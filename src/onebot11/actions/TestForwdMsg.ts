import { OB11Message } from '../types';
import BaseAction from "./BaseAction";
import { ActionName } from "./types";
import { NTQQApi, Peer } from "../../ntqqapi/ntcall";
import { ChatType } from "../../ntqqapi/types";
import { selfInfo } from "../../common/data";
import { SendMsgElementConstructor } from "../../ntqqapi/constructor";
import {sleep} from "../../common/utils";


export interface PayloadType {
    message: string,
    group_id: string
}

export default class TestForwardMsg extends BaseAction<PayloadType, OB11Message> {
    actionName = ActionName.TestForwardMsg

    protected async _handle(payload: PayloadType) {
        // log("history msg ids", Object.keys(msgHistory));
        const selfPeer: Peer = {
            chatType: ChatType.friend,
            peerUid: selfInfo.uid
        }
        const sendMsg = await NTQQApi.sendMsg(selfPeer, [SendMsgElementConstructor.text(payload.message)])
        const sendMsg2 = await NTQQApi.sendMsg(selfPeer, [SendMsgElementConstructor.text(payload.message)])
        await NTQQApi.multiForwardMsg(
            selfPeer,
            {chatType: ChatType.group, peerUid: payload.group_id, guildId: ""},
            [sendMsg.msgId, sendMsg2.msgId]
        )
        return null
    }
}