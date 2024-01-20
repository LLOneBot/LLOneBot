const fs = require('fs');

export function log(msg: any) {
    let currentDateTime = new Date().toLocaleString();
    fs.appendFile("./llonebot.log", currentDateTime + ":" + msg + "\n", (err: any) => {

    })
}

export function isGIF(path: string) {
    const buffer = Buffer.alloc(4);
    const fd = fs.openSync(path, 'r');
    fs.readSync(fd, buffer, 0, 4, 0);
    fs.closeSync(fd);
    return buffer.toString() === 'GIF8'
}