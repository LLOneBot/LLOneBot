// Electron 主进程 与 渲染进程 交互的桥梁

import {Config, Group, PostDataSendMsg, User} from "./common/types";
import {
    CHANNEL_GET_CONFIG, CHANNEL_LOG, CHANNEL_POST_ONEBOT_DATA,
    CHANNEL_RECALL_MSG, CHANNEL_SEND_MSG,
    CHANNEL_SET_CONFIG,
    CHANNEL_START_HTTP_SERVER, CHANNEL_UPDATE_FRIENDS, CHANNEL_UPDATE_GROUPS
} from "./common/IPCChannel";


const {contextBridge} = require("electron");
const {ipcRenderer} = require('electron');

// 在window对象下导出只读对象
contextBridge.exposeInMainWorld("llonebot", {

    postData: (data: any) => {
        ipcRenderer.send(CHANNEL_POST_ONEBOT_DATA, data);
    },
    updateGroups: (groups: Group[]) => {
        ipcRenderer.send(CHANNEL_UPDATE_GROUPS, groups);
    },
    updateFriends: (friends: User[]) => {
        ipcRenderer.send(CHANNEL_UPDATE_FRIENDS, friends);
    },
    listenSendMessage: (handle: (jsonData: PostDataSendMsg) => void) => {
        ipcRenderer.on(CHANNEL_SEND_MSG, (event: any, args: PostDataSendMsg) => {
            handle(args)
        })
    },
    listenRecallMessage: (handle: (jsonData: {message_id: string}) => void) => {
        ipcRenderer.on(CHANNEL_RECALL_MSG, (event: any, args: {message_id: string}) => {
            handle(args)
        })
    },
    startExpress: () => {
        ipcRenderer.send(CHANNEL_START_HTTP_SERVER);
    },
    log: (data: any) => {
        ipcRenderer.send(CHANNEL_LOG, data);
    },
    setConfig: (config: Config)=>{
        ipcRenderer.send(CHANNEL_SET_CONFIG, config);
    },
    getConfig: async () => {
        return ipcRenderer.invoke(CHANNEL_GET_CONFIG);
    }
    // startExpress,
});