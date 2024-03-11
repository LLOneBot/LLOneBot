import {OB11GroupNoticeEvent} from "./OB11GroupNoticeEvent";

export class OB11GroupIncreaseEvent extends OB11GroupNoticeEvent {
    notice_type = "group_increase";
    sub_type = "approve";  // TODO: 实现其他几种子类型的识别 ("approve" | "invite")
    operator_id: number;

    constructor(groupId: number, userId: number, operatorId: number) {
        super();
        this.group_id = groupId;
        this.operator_id = operatorId;
        this.user_id = userId;
    }
}
