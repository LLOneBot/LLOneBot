import {OB11GroupNoticeEvent} from "./OB11GroupNoticeEvent";

type GroupIncreaseSubType = "approve" | "invite";
export class OB11GroupIncreaseEvent extends OB11GroupNoticeEvent {
    notice_type = "group_increase";
    operator_id: number;
    sub_type: GroupIncreaseSubType;
    constructor(groupId: number, userId: number, operatorId: number, subType: GroupIncreaseSubType = "approve") {
        super();
        this.group_id = groupId;
        this.operator_id = operatorId;
        this.user_id = userId;
        this.sub_type = subType
    }
}
