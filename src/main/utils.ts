import * as path from "path";
import {json} from "express";
import {selfInfo} from "./data";

const fs = require('fs');

export const CONFIG_DIR = global.LiteLoader.plugins["LLOneBot"].path.data;
export function log(msg: any) {
    let currentDateTime = new Date().toLocaleString();
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currentDate = `${year}-${month}-${day}`;
    const userInfo = selfInfo.user_id ? `${selfInfo.nickname}(${selfInfo.user_id})` : ""
    fs.appendFile(path.join(CONFIG_DIR , `llonebot-${currentDate}.log`), currentDateTime + ` ${userInfo}:` + JSON.stringify(msg) + "\n", (err: any) => {

    })
}

export function isGIF(path: string) {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(path, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    return buffer.toString() === 'GIF8'
}


// 定义一个异步函数来检查文件是否存在
export function checkFileReceived(path: string, timeout: number=3000): Promise<void> {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        function check() {
            if (fs.existsSync(path)) {
                resolve();
            } else if (Date.now() - startTime > timeout) {
                reject(new Error(`文件不存在: ${path}`));
            } else {
                setTimeout(check, 100);
            }
        }

        check();
    });
}