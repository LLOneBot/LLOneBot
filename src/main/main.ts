// 运行在 Electron 主进程 下的插件入口

import * as path from "path";

const fs = require('fs');
import {ipcMain} from 'electron';

import {Config, Group, User} from "../common/types";
import {
    CHANNEL_GET_CONFIG, CHANNEL_LOG, CHANNEL_POST_ONEBOT_DATA,
    CHANNEL_SET_CONFIG,
    CHANNEL_START_HTTP_SERVER, CHANNEL_UPDATE_FRIENDS,
    CHANNEL_UPDATE_GROUPS
} from "../common/IPCChannel";
import {ConfigUtil} from "./config";
import {startExpress} from "./HttpServer";
import {log} from "./utils";
import {friends, groups} from "./data";



// 加载插件时触发
function onLoad(plugin: any) {

    const configFilePath = path.join(plugin.path.data, "config.json")
    let configUtil = new ConfigUtil(configFilePath)

    if (!fs.existsSync(plugin.path.data)) {
        fs.mkdirSync(plugin.path.data, {recursive: true});
    }
    ipcMain.handle(CHANNEL_GET_CONFIG, (event: any, arg: any) => {
        return configUtil.getConfig()
    })
    ipcMain.on(CHANNEL_SET_CONFIG, (event: any, arg: Config) => {
        fs.writeFileSync(configFilePath, JSON.stringify(arg, null, 2), "utf-8")
    })

    ipcMain.on(CHANNEL_START_HTTP_SERVER, (event: any, arg: any) => {
        startExpress(configUtil.getConfig().port)
    })

    ipcMain.on(CHANNEL_UPDATE_GROUPS, (event: any, arg: Group[]) => {
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
        groups.length = 0
        groups.push(...arg)
    })

    ipcMain.on(CHANNEL_UPDATE_FRIENDS, (event: any, arg: User[]) => {
        friends.length = 0
        friends.push(...arg)
    })

    ipcMain.on(CHANNEL_POST_ONEBOT_DATA, (event: any, arg: any) => {
        try {
            fetch(configUtil.getConfig().host, {
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

    ipcMain.on(CHANNEL_LOG, (event: any, arg: any) => {
        log(arg)
    })


}


// 创建窗口时触发
function onBrowserWindowCreated(window: any, plugin: any) {

}


// 这两个函数都是可选的
export {
    onLoad, onBrowserWindowCreated
}