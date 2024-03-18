import {selfInfo} from "../data";
import fs from "fs";
import path from "node:path";
import {DATA_DIR, truncateString} from "./index";
import {getConfigUtil} from "../config";

export function log(...msg: any[]) {
    if (!getConfigUtil().getConfig().log) {
        return //console.log(...msg);
    }
    let currentDateTime = new Date().toLocaleString();
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currentDate = `${year}-${month}-${day}`;
    const userInfo = selfInfo.uin ? `${selfInfo.nick}(${selfInfo.uin})` : ""
    let logMsg = "";
    for (let msgItem of msg) {
        // 判断是否是对象
        if (typeof msgItem === "object") {
            let obj = JSON.parse(JSON.stringify(msgItem));
            logMsg += JSON.stringify(truncateString(obj)) + " ";
            continue;
        }
        logMsg += msgItem + " ";
    }
    logMsg = `${currentDateTime} ${userInfo}: ${logMsg}\n\n`
    // sendLog(...msg);
    // console.log(msg)
    fs.appendFile(path.join(DATA_DIR, `llonebot-${currentDate}.log`), logMsg, (err: any) => {

    })
}