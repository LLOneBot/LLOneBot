/// <reference path="./global.d.ts" />

// import express from "express";


const host = "http://localhost:5000"

let self_qq: string = ""

let uid_maps: Record<string, string> = {}  // 一串加密的字符串 -> qq号

let groups: Group[] = []
let friends: User[] = []

function getFriend(qq: string){
    return friends.find(friend => friend.uid == qq)
}

function getGroup(qq: string){
    return groups.find(group => group.uid == qq)
}

function onLoad(){
    LLAPI.getAccountInfo().then(accountInfo => {
        self_qq = accountInfo.uid
    })

    LLAPI.getGroupsList(false).then(groupsList => {
        groups = groupsList
    })

//     const app = express();
//     const port = 3000;
//
//     // 中间件，用于解析POST请求的请求体
//     app.use(express.urlencoded({ extended: true }));
//     app.use(express.json());
//
//     // 处理POST请求的路由
//     app.post('/', (req: any, res: any) => {
//         let json_data: {action: string, params: {
//                 user_id: string,
//                 group_id: string,
//                 message: SendMessage[];
//             }} = req.body;
//         let peer: Peer| null = null;
//         if (json_data.action == "send_private_msg"){
//             let friend = getFriend(json_data.params.user_id)
//             if (friend) {
//                 peer = {
//                     chatType: "private",
//                     name: friend.nickName,
//                     uid: friend.uin
//                 }
//             }
//         }
//         else if (json_data.action == "send_group_msg"){
//             let group = getGroup(json_data.params.group_id)
//             if (group){
//                 peer = {
//                     chatType: "group",
//                     name: group.name,
//                     uid: group.uid
//                 }
//             }
//         }
//         if (peer) {
//             LLAPI.sendMessage(peer, json_data.params.message).then(res => console.log("消息发送成功:", res),
//                 err => console.log("消息发送失败", json_data, err))
//         }
//         console.log(req.body); // 输出POST请求的请求体数据
//         res.send('POST请求已收到');
//     });
//
// // 启动服务器监听指定端口
//     app.listen(port, () => {
//         console.log(`服务器已启动，监听端口 ${port}`);
//     });

    LLAPI.on("new-messages", (messages) => {
        console.log("收到新消息", messages)
        messages.forEach(message => {
            let onebot_message_data: any = {
                self: {
                    platform: "qq",
                    user_id: self_qq
                },
                time: 0,
                type: "message",
                detail_type: message.peer.chatType,
                sub_type: "",
                message: message.raw.elements.map(element=>{
                    let message_data: any =  {
                        data: {}
                    }
                    if (element.raw.textElement?.atType == AtType.atUser){
                        message_data["type"] = "at"
                        message_data["data"]["mention"] = element.raw.textElement.atUid
                    }
                    else if (element.raw.textElement){
                        message_data["type"] = "text"
                        message_data["data"]["text"] = element.raw.textElement.content
                    }
                    else if (element.raw.picElement){
                        message_data["type"] = "image"
                        message_data["data"]["file_id"] = element.raw.picElement.fileUuid
                        message_data["data"]["path"] = element.raw.picElement.sourcePath
                    }
                    else if (element.raw.replyElement){
                        message_data["type"] = "reply"
                        message_data["data"]["reply"] = element.raw.replyElement.sourceMsgIdInRecords
                    }
                    return message_data
                })
            }

            if (message.peer.chatType == "group"){
                onebot_message_data["group_id"] = message.peer.uid
                // todo: 将加密的uid转成qq号
                onebot_message_data["user_id"] = message.sender.uid
            }
            else if (message.peer.chatType == "private"){
                onebot_message_data["user_id"] = message.peer.uid
            }

            fetch(host + "", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(onebot_message_data)
            }).then(res => {}, err => {
                console.log(err)
            })
        });
    });
    // console.log("getAccountInfo", LLAPI.getAccountInfo());
}

// 打开设置界面时触发
function onConfigView(view: any) {

}

export {
    onLoad,
    onConfigView
}