import {OB11GroupNoticeEvent} from "../notice/OB11GroupNoticeEvent";


export class OB11GroupRequestEvent extends OB11GroupNoticeEvent{
    request_type: "group" = "group";
    sub_type: "add" | "invite" = "add";
    comment: string;
    flag: string;
}