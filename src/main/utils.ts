import { text } from "express";

const fs = require('fs');

export function log(msg: any) {
    let currentDateTime = new Date().toLocaleString();
    fs.appendFile("./llonebot.log", currentDateTime + ":" + msg + "\n", (err: any) => {

    })
}

// @SiberianHusky 2021-08-15
export default function judgeMessage(msg) {
        if(msg[0]!=null&&msg[0]["type"]!=null&&msg[0]["data"]!=null){
            let type = msg[0]["type"];
            let data = msg[0]["data"];
            if(type == "text"){
                if (data["text"]!=""&&data["text"]!=null){
                    return 200;
                }
                else if(type==="image"){
                    if(data["file"]!=""&&data["file"]!=null){
                        return 200;
                    }
                }
                else if(type==="voice"){
                    if(data["file"]!=""&&data["file"]!=null){
                        return 200;
                    }
                }
                else if(type==="at"){
                    if(data["qq"]!=""&&data["qq"]!=null){
                        return 200;
                    }
                }
                else if(type==="reply"){
                    if(data["id"]!=""&&data["id"]!=null){
                        return 200;
                    }
                }
        }
        return 400;
    }
}
// ==end==