import BaseAction from "./BaseAction";
import {getGroupMember} from "../../common/data";
import {GroupMemberRole} from "../../ntqqapi/types";
import {ActionName} from "./types";
import {NTQQGroupApi} from "../../ntqqapi/api/group";

interface Payload {
    group_id: number,
    user_id: number,
    enable: boolean
}

export default class SetGroupAdmin extends BaseAction<Payload, null> {
    actionName = ActionName.SetGroupAdmin

    protected async _handle(payload: Payload): Promise<null> {
        const member = await getGroupMember(payload.group_id, payload.user_id)
        if (!member) {
            throw `群成员${payload.user_id}不存在`
        }
        await NTQQGroupApi.setMemberRole(payload.group_id.toString(), member.uid, payload.enable ? GroupMemberRole.admin : GroupMemberRole.normal)
        return null
    }
}