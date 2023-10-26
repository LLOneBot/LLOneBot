// 运行在 Electron 主进程 下的插件入口
const express = require("express");

let groups: Group[] = []
let friends: User[] = []

function getFriend(qq: string){
    return friends.find(friend => friend.uid == qq)
}

function getGroup(qq: string){
    return groups.find(group => group.uid == qq)
}

// 加载插件时触发
function onLoad(plugin: any) {

    const app = express();
    const port = 3000;

    // 中间件，用于解析POST请求的请求体
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get('/', (req: any, res: any) => {
        res.send('llonebot已启动');
    })
    // 处理POST请求的路由
    app.post('/', (req: any, res: any) => {
        let json_data: {action: string, params: {
                user_id: string,
                group_id: string,
                message: SendMessage[];
            }} = req.body;
        let peer: Peer| null = null;
        if (json_data.action == "send_private_msg"){
            let friend = getFriend(json_data.params.user_id)
            if (friend) {
                peer = {
                    chatType: "private",
                    name: friend.nickName,
                    uid: friend.uin
                }
            }
        }
        else if (json_data.action == "send_group_msg"){
            let group = getGroup(json_data.params.group_id)
            if (group){
                peer = {
                    chatType: "group",
                    name: group.name,
                    uid: group.uid
                }
            }
        }
        if (peer) {
            LLAPI.sendMessage(peer, json_data.params.message).then(res => console.log("消息发送成功:", res),
                err => console.log("消息发送失败", json_data, err))
        }
        console.log(req.body); // 输出POST请求的请求体数据
        res.send('POST请求已收到');
    });
    app.listen(port, () => {
        console.log(`服务器已启动，监听端口 ${port}`);
    });


}


// 创建窗口时触发
function onBrowserWindowCreated(window: any, plugin: any) {

}


// 这两个函数都是可选的
module.exports = {
    onLoad,
    onBrowserWindowCreated
}