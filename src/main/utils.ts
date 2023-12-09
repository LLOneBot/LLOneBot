const fs = require('fs');

export function log(msg: any) {
    let currentDateTime = new Date().toLocaleString();
    fs.appendFile("./llonebot.log", currentDateTime + ":" + msg + "\n", (err: any) => {

    })
}