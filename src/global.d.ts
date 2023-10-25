declare enum AtType {
    notAt = 0,
    atUser = 2
}

declare type Peer = {
    chatType: "private" | "group"
    name: string
    uid: string  // qq号
}

interface MessageElement{
    elements:{
        type: "text",
        content: string,
        raw: {
            textElement: {
                atType: AtType
                atUid: string
            }
        }
    }[]
    peer: Peer,
    sender: {
        uid: string  // 一串加密的字符串
        memberName: string
        nickname: string
    }
}

declare var LLAPI: {
    on(event: "new-messages", callback: (data: MessageElement[]) => void): void;
    getAccountInfo(): {
        uid: string  // qq
        uin: string  // 一串加密的字符串
    }
    getUserInfo(uid: string):{nickName: string};
    sendMessage(peer: Peer, message:
        {
            type: "text",
            content: string,}|
        {
            type: "image",
            file: string,
        }
    ): void
    getGroupList(forced: boolean): {

    }[]
    getFriendList(forced: boolean): {

    }[]
};
