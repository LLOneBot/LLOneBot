import GetMsg from './GetMsg'
import GetLoginInfo from './GetLoginInfo'
import GetFriendList from './GetFriendList'
import GetGroupList from './GetGroupList'
import GetGroupInfo from './GetGroupInfo'
import GetGroupMemberList from './GetGroupMemberList'
import GetGroupMemberInfo from './GetGroupMemberInfo'
import SendGroupMsg from './SendGroupMsg'
import SendPrivateMsg from './SendPrivateMsg'
import SendMsg from './SendMsg'
import DeleteMsg from "./DeleteMsg";
import BaseAction from "./BaseAction";
import GetVersionInfo from "./GetVersionInfo";
import CanSendRecord from "./CanSendRecord";
import CanSendImage from "./CanSendImage";
import GetStatus from "./GetStatus";
import {GoCQHTTPSendGroupForwardMsg, GoCQHTTPSendPrivateForwardMsg} from "./go-cqhttp/SendForwardMsg";
import GoCQHTTPGetStrangerInfo from "./go-cqhttp/GetStrangerInfo";
import SendLike from "./SendLike";
import SetGroupAddRequest from "./SetGroupAddRequest";
import SetGroupLeave from "./SetGroupLeave";
import GetGuildList from "./GetGuildList";

export const actionHandlers = [
    new SendLike(),
    new GetMsg(),
    new GetLoginInfo(),
    new GetFriendList(),
    new GetGroupList(), new GetGroupInfo(), new GetGroupMemberList(), new GetGroupMemberInfo(),
    new SendGroupMsg(), new SendPrivateMsg(), new SendMsg(),
    new DeleteMsg(),
    new SetGroupAddRequest(),
    new SetGroupLeave(),
    new GetVersionInfo(),
    new CanSendRecord(),
    new CanSendImage(),
    new GetStatus(),

    //以下为go-cqhttp api
    new GoCQHTTPSendGroupForwardMsg(),
    new GoCQHTTPSendPrivateForwardMsg(),
    new GoCQHTTPGetStrangerInfo(),
    new GetGuildList()

]

function initActionMap() {
    const actionMap = new Map<string, BaseAction<any, any>>();
    for (const action of actionHandlers) {
        actionMap.set(action.actionName, action);
    }

    return actionMap
}

export const actionMap = initActionMap();
