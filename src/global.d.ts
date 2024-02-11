import {
    Config,
    Group,
    GroupMemberInfo,
    MessageElement,
    Peer,
    PostDataSendMsg, PttElement, RawMessage,
    SelfInfo,
    User
} from "./common/types";
import { SendIPCMsgSession } from "./main/ipcsend";
import { LLOneBot } from './preload'

import {OB11Return, OB11MessageData, OB11SendMsgReturn} from "./onebot11/types";


declare var LLAPI: {
    on(event: "new-messages" | "new-send-messages", callback: (data: MessageElement[]) => void): void;
    on(event: "context-msg-menu", callback: (event: any, target: any, msgIds:any) => void): void;
    getAccountInfo(): Promise<{
        uid: string  // 一串加密的字符串
        uin: string  // qq
    }>

    getUserInfo(uid: string): Promise<User>; // uid是一串加密的字符串
    sendMessage(peer: Peer, message: OB11MessageData[]): Promise<any>;
    recallMessage(peer: Peer, msgIds: string[]): Promise<void>;
    getGroupsList(forced: boolean): Promise<Group[]>
    getFriendsList(forced: boolean): Promise<User[]>
    getGroupMemberList(group_id: string, num: number): Promise<{result: { infos: Map<string, GroupMemberInfo> }}>
    getPeer(): Promise<Peer>
    add_qmenu(func: (qContextMenu: Node)=>void): void
    Ptt2Text(msgId:string, peer: Peer, elements: MessageElement[]): Promise<any>

};


declare var llonebot: LLOneBot

declare global {
    interface Window {
        LLAPI: typeof LLAPI;
        llonebot: typeof llonebot;
        LiteLoader: any;
    }
}