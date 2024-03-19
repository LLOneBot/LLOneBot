import {OB11GroupMember} from '../types';
import {getGroupMember} from "../../common/data";
import {OB11Constructor} from "../constructor";
import BaseAction from "./BaseAction";
import {ActionName} from "./types";
import {NTQQUserApi} from "../../ntqqapi/api/user";
import {log} from "../../common/utils/log";
import {isNull} from "../../common/utils/helper";


export interface PayloadType {
    group_id: number
    user_id: number
}

class GetGroupMemberInfo extends BaseAction<PayloadType, OB11GroupMember> {
    actionName = ActionName.GetGroupMemberInfo

    protected async _handle(payload: PayloadType) {
        const member = await getGroupMember(payload.group_id.toString(), payload.user_id.toString())
        if (member) {
            if (isNull(member.sex)){
                log("获取群成员详细信息")
                let info = (await NTQQUserApi.getUserDetailInfo(member.uid))
                log("群成员详细信息结果", info)
                Object.assign(member, info);
            }
            return OB11Constructor.groupMember(payload.group_id.toString(), member)
        } else {
            throw (`群成员${payload.user_id}不存在`)
        }
    }
}

export default GetGroupMemberInfo