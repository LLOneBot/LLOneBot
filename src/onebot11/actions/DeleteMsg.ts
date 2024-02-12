import { ActionName } from "./types";
import BaseAction from "./BaseAction";
import { NTQQApi } from "../../ntqqapi/ntcall";
import { msgHistory } from "../../common/data";

interface Payload {
    message_id: string
}

class DeleteMsg extends BaseAction<Payload, void> {
    actionName = ActionName.DeleteMsg

    protected async _handle(payload:Payload){
        let msg = msgHistory[payload.message_id]
        await NTQQApi.recallMsg({
            chatType: msg.chatType,
            peerUid: msg.peerUid
        }, [payload.message_id])
    }
}

export default DeleteMsg