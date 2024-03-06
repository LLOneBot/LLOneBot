import {ActionName} from "./types";
import BaseAction from "./BaseAction";
import {NTQQApi} from "../../ntqqapi/ntcall";
import {dbUtil} from "../../common/db";

interface Payload {
    message_id: number
}

class DeleteMsg extends BaseAction<Payload, void> {
    actionName = ActionName.DeleteMsg

    protected async _handle(payload: Payload) {
        let msg = await dbUtil.getMsgByShortId(payload.message_id)
        await NTQQApi.recallMsg({
            chatType: msg.chatType,
            peerUid: msg.peerUid
        }, [msg.msgId])
    }
}

export default DeleteMsg