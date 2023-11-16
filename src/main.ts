// 运行在 Electron 主进程 下的插件入口

import * as path from "path";

const fs = require('fs');
import {ipcMain, webContents} from 'electron';

const express = require("express");
import {Config, Group, PostDataSendMsg, User} from "./types";

const CHANNEL_SEND_MSG = "llonebot_sendMsg"
const CHANNEL_RECALL_MSG = "llonebot_recallMsg"

let groups: Group[] = []
let friends: User[] = []

function sendIPCMsg(channel: string, data: any) {
    let contents = webContents.getAllWebContents();
    for (const content of contents) {
        try {
            content.send(channel, data)
        } catch (e) {
        }
    }
}

function sendIPCCallSendQQMsg(postData: PostDataSendMsg) {
    sendIPCMsg(CHANNEL_SEND_MSG, postData);
}

function log(msg: any) {
    let currentDateTime = new Date().toLocaleString();
    fs.appendFile("./llonebot.log", currentDateTime + ":" + msg + "\n", (err: any) => {

    })
}


function startExpress(event: any, port: number) {
    // const original_send = (window.webContents.__qqntim_original_object && window.webContents.__qqntim_original_object.send) || window.webContents.send;
    const app = express();

    // 中间件，用于解析POST请求的请求体
    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.get('/', (req: any, res: any) => {
        res.send('llonebot已启动');
    })

    function handlePost(jsonData: any) {
        let resData = {
            status: 0,
            retcode: 0,
            data: {},
            message: ''
        }
        if (jsonData.action == "send_private_msg" || jsonData.action == "send_group_msg") {
            sendIPCCallSendQQMsg(jsonData);
        } else if (jsonData.action == "get_group_list") {
            resData["data"] = groups.map(group => {
                return {
                    group_id: group.uid,
                    group_name: group.name,
                    group_members: group.members.map(member => {
                        return {
                            user_id: member.uin,
                            user_name: member.cardName || member.nick,
                            user_display_name: member.cardName || member.nick
                        }
                    })
                }
            })
        } else if (jsonData.action == "get_group_member_list") {
            let group = groups.find(group => group.uid == jsonData.params.group_id)
            if (group) {
                resData["data"] = group?.members?.map(member => {
                    let role = "member"
                    switch (member.role) {
                        case 4: {
                            role = "owner"
                            break;
                        }
                        case 3: {
                            role = "admin"
                            break
                        }
                        case 2: {
                            role = "member"
                            break
                        }

                    }
                    return {
                        user_id: member.uin,
                        user_name: member.nick,
                        user_display_name: member.cardName || member.nick,
                        nickname: member.nick,
                        card: member.cardName,
                        role
                    }

                }) || []
            } else {
                resData["data"] = []
            }
        } else if (jsonData.action == "get_friend_list") {
            resData["data"] = friends.map(friend => {
                return {
                    user_id: friend.uin,
                    user_name: friend.nickName,
                }
            })
        } else if (jsonData.action == "delete_msg") {
            sendIPCMsg(CHANNEL_RECALL_MSG, jsonData as { message_id: string })
        }
        return resData
    }

    // 处理POST请求的路由
    app.post('/', (req: any, res: any) => {
        let jsonData: PostDataSendMsg = req.body;
        let resData = handlePost(jsonData)
        res.send(resData)
    });
    app.post('/send_private_msg', (req: any, res: any) => {
        let jsonData: PostDataSendMsg = req.body;
        jsonData.action = "send_private_msg"
        let resData = handlePost(jsonData)
        res.send(resData)
    })
    app.post('/send_group_msg', (req: any, res: any) => {
        let jsonData: PostDataSendMsg = req.body;
        jsonData.action = "send_group_msg"
        let resData = handlePost(jsonData)
        res.send(resData)
    })
    app.post('/send_msg', (req: any, res: any) => {
        let jsonData: PostDataSendMsg = req.body;
        if (jsonData.message_type == "private") {
            jsonData.action = "send_private_msg"
        } else if (jsonData.message_type == "group") {
            jsonData.action = "send_group_msg"
        } else {
            if (jsonData.params.group_id) {
                jsonData.action = "send_group_msg"
            } else {
                jsonData.action = "send_private_msg"
            }
        }
        let resData = handlePost(jsonData)
        res.send(resData)
    })
    app.post('/delete_msg', (req: any, res: any) => {
        let jsonData: PostDataSendMsg = req.body;
        jsonData.action = "delete_msg"
        let resData = handlePost(jsonData)
        res.send(resData)
    })
    app.listen(port, "0.0.0.0", () => {
        console.log(`服务器已启动，监听端口 ${port}`);
    });
}


// 加载插件时触发
function onLoad(plugin: any) {
    function getConfig(): Config{
        if (!fs.existsSync(configFilePath)) {
            return {"port":3000, "host": "http://localhost:5000/"}
        } else {
            const data = fs.readFileSync(configFilePath, "utf-8");
            return JSON.parse(data);
        }
    }

    ipcMain.on("startExpress", (event: any, arg: any) => {
        startExpress(event, getConfig().port)
    })

    ipcMain.on("updateGroups", (event: any, arg: Group[]) => {
        for (const group of arg) {
            let existGroup = groups.find(g => g.uid == group.uid)
            if (existGroup) {
                if (!existGroup.members) {
                    existGroup.members = []
                }
                existGroup.name = group.name
                for (const member of group.members || []) {
                    let existMember = existGroup.members?.find(m => m.uin == member.uin)
                    if (existMember) {
                        existMember.nick = member.nick
                        existMember.cardName = member.cardName
                    } else {
                        existGroup.members?.push(member)
                    }
                }
            } else {
                groups.push(group)
            }
        }
        groups = arg
    })

    ipcMain.on("updateFriends", (event: any, arg: User[]) => {
        friends = arg
    })

    ipcMain.on("postOnebotData", (event: any, arg: any) => {
        // try {
        //     // const fetch2 = require("./electron-fetch");
        // }catch (e) {
        //     log(e)
        // }
        log("开始post新消息事件到服务器")
        try {
            fetch(getConfig().host, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(arg)
            }).then((res: any) => {
                log("新消息事件上传");
            }, (err: any) => {
                log("新消息事件上传失败:" + err + JSON.stringify(arg));
            });
        } catch (e: any) {
            log(e.toString())
        }
    })

    ipcMain.on("llonebot_log", (event: any, arg: any) => {
        log(arg)
    })

    if (!fs.existsSync(plugin.path.data)) {
        fs.mkdirSync(plugin.path.data, {recursive: true});
    }
    const configFilePath = path.join(plugin.path.data, "config.json")
    ipcMain.handle("llonebot_getConfig", (event: any, arg: any) => {
        return getConfig()
    })
    ipcMain.on("llonebot_setConfig", (event: any, arg: Config) => {
        fs.writeFileSync(configFilePath, JSON.stringify(arg, null, 2), "utf-8")
    })
}


// 创建窗口时触发
function onBrowserWindowCreated(window: any, plugin: any) {

}


// 这两个函数都是可选的
// module.exports = {
//     onLoad,
//     onBrowserWindowCreated
// }
// function onLoad(plugin: any) {
//
// }
export {
    onLoad, onBrowserWindowCreated
}