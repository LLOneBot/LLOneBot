// 运行在 Electron 主进程 下的插件入口

import * as path from "path";

const fs = require('fs');
import {ipcMain} from 'electron';

import {Config, Group, SelfInfo, User} from "../common/types";
import {
    CHANNEL_DOWNLOAD_FILE,
    CHANNEL_GET_CONFIG, CHANNEL_GET_SELF_INFO, CHANNEL_LOG, CHANNEL_POST_ONEBOT_DATA,
    CHANNEL_SET_CONFIG,
    CHANNEL_START_HTTP_SERVER, CHANNEL_UPDATE_FRIENDS,
    CHANNEL_UPDATE_GROUPS
} from "../common/IPCChannel";
import {ConfigUtil} from "./config";
import {startExpress} from "./HttpServer";
import {log} from "./utils";
import {friends, groups, selfInfo} from "./data";



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
    ipcMain.handle(CHANNEL_DOWNLOAD_FILE, async (event: any, arg: {uri: string, localFilePath: string}) => {
        let url = new URL(arg.uri);
        if (url.protocol == "base64:"){
            // base64转成文件
            let base64Data = arg.uri.split("base64://")[1]
            const buffer = Buffer.from(base64Data, 'base64');

            fs.writeFileSync(arg.localFilePath, buffer);
        }
        else if (url.protocol == "http:" || url.protocol == "https:") {
            // 下载文件
            let res = await fetch(url)
            let blob = await res.blob();
            let buffer = await blob.arrayBuffer();
            fs.writeFileSync(arg.localFilePath, Buffer.from(buffer));
        }
        return arg.localFilePath;
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
        for(const host of configUtil.getConfig().hosts) {
            try {
                fetch(host, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-self-id": selfInfo.user_id
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
        }
    })

    ipcMain.on(CHANNEL_LOG, (event: any, arg: any) => {
        log(arg)
    })

    ipcMain.on(CHANNEL_GET_SELF_INFO, (event: any, arg: SelfInfo) => {
        selfInfo.user_id = arg.user_id;
        selfInfo.nickname = arg.nickname;
    })
}


// 创建窗口时触发
function onBrowserWindowCreated(window: any, plugin: any) {

}


// 这两个函数都是可选的
export {
    onLoad, onBrowserWindowCreated
}