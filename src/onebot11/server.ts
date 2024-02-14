import { getConfigUtil, log } from "../common/utils";

const express = require("express");
const expressWs = require("express-ws");

import { Request } from 'express';
import { Response } from 'express';

const JSONbig = require('json-bigint')({ storeAsString: true });
import { selfInfo } from "../common/data";
import { OB11Message, OB11Return, OB11MessageData } from './types';
import {actionHandlers, actionMap} from "./actions";
import {OB11Response, OB11WebsocketResponse} from "./actions/utils";


// @SiberianHusky 2021-08-15
function checkSendMessage(sendMsgList: OB11MessageData[]) {
    function checkUri(uri: string): boolean {
        const pattern = /^(file:\/\/|http:\/\/|https:\/\/|base64:\/\/)/;
        return pattern.test(uri);
    }

    for (let msg of sendMsgList) {
        if (msg["type"] && msg["data"]) {
            let type = msg["type"];
            let data = msg["data"];
            if (type === "text" && !data["text"]) {
                return 400;
            } else if (["image", "voice", "record"].includes(type)) {
                if (!data["file"]) {
                    return 400;
                } else {
                    if (checkUri(data["file"])) {
                        return 200;
                    } else {
                        return 400;
                    }
                }

            } else if (type === "at" && !data["qq"]) {
                return 400;
            } else if (type === "reply" && !data["id"]) {
                return 400;
            }
        } else {
            return 400
        }
    }
    return 200;
}

// ==end==

const expressAPP = express();
expressAPP.use(express.urlencoded({ extended: true, limit: "500mb" }));

const expressWsApp = express();
const websocketClientConnections = [];

expressAPP.use((req, res, next) => {
    let data = '';
    req.on('data', chunk => {
        data += chunk.toString();
    });
    req.on('end', () => {
        if (data) {
            try {
                // log("receive raw", data)
                req.body = JSONbig.parse(data);
            } catch (e) {
                return next(e);
            }
        }
        next();
    });
});

export function startExpress(port: number) {

    expressAPP.get('/', (req: Request, res: Response) => {
        res.send('llonebot已启动');
    })

    if (getConfigUtil().getConfig().enableHttp) {
        expressAPP.listen(port, "0.0.0.0", () => {
            console.log(`llonebot http service started 0.0.0.0:${port}`);
        });
    }
}

export function startWebsocketServer(port: number) {
    const config = getConfigUtil().getConfig();
    if (config.enableWs) {
        expressWs(expressWsApp)
        expressWsApp.listen(getConfigUtil().getConfig().wsPort, function () {
            console.log(`llonebot websocket service started 0.0.0.0:${port}`);
        });
    }
}

export function initWebsocket() {
    if (getConfigUtil().getConfig().enableWs) {
        expressWsApp.ws("/api", onWebsocketMessage);
        expressWsApp.ws("/", onWebsocketMessage);
    }

    initReverseWebsocket();
}

function initReverseWebsocket() {
    const config = getConfigUtil().getConfig();
    if (config.enableWsReverse) {
        for (const url of config.wsHosts) {
            try {
                const wsClient = new WebSocket(url);
                websocketClientConnections.push(wsClient);

                wsClient.onclose = function (ev) {
                    let index = websocketClientConnections.indexOf(wsClient);
                    if (index !== -1) {
                        websocketClientConnections.splice(index, 1);
                    }
                }

                wsClient.onmessage = async function (ev) {
                    let message = ev.data;
                    if (typeof message === "string") {
                        try {
                            let recv = JSON.parse(message);
                            let echo = recv.echo ?? "";

                            if (actionMap.has(recv.action)) {
                                let action = actionMap.get(recv.action);
                                const result = await action.websocketHandle(recv.params, echo);
                                wsClient.send(JSON.stringify(result));
                            }
                            else {
                                wsClient.send(JSON.stringify(OB11WebsocketResponse.error("Bad Request", 1400, echo)));
                            }
                        } catch (e) {
                            log(e.stack);
                            wsClient.send(JSON.stringify(OB11WebsocketResponse.error(e.stack.toString(), 1200)));
                        }
                    }
                }
            }
            catch (e) {}
        }
    }
}

function onWebsocketMessage(ws, req) {
    ws.on("message", async function (message) {
        try {
            let recv = JSON.parse(message);
            let echo = recv.echo ?? "";

            if (actionMap.has(recv.action)) {
                let action = actionMap.get(recv.action)
                const result = await action.websocketHandle(recv.params, echo);
                ws.send(JSON.stringify(result));
            }
            else {
                ws.send(JSON.stringify(OB11WebsocketResponse.error("Bad Request", 1400, echo)));
            }
        } catch (e) {
            log(e.stack);
            ws.send(JSON.stringify(OB11WebsocketResponse.error(e.stack.toString(), 1200)));
        }
    })
}


export function postMsg(msg: OB11Message) {
    const config = getConfigUtil().getConfig();
    if (config.enableHttpPost) {
        if (!config.reportSelfMessage) {
            if (msg.user_id == selfInfo.uin) {
                return
            }
        }
        for (const host of config.httpHosts) {
            fetch(host, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-self-id": selfInfo.uin
                },
                body: JSON.stringify(msg)
            }).then((res: any) => {
                log(`新消息事件上报成功: ${host} ` + JSON.stringify(msg));
            }, (err: any) => {
                log(`新消息事件上报失败: ${host} ` + err + JSON.stringify(msg));
            });
        }
    }

}

let routers: Record<string, (payload: any) => Promise<OB11Return<any>>> = {};

function registerRouter(action: string, handle: (payload: any) => Promise<any>) {
    let url = action.toString()
    if (!action.startsWith("/")) {
        url = "/" + action
    }
    async function _handle(res: Response, payload: any) {
        log("receive post data", url, payload)
        try {
            const result = await handle(payload)
            res.send(result)
        }
        catch (e) {
            log(e.stack);
            res.send(OB11Response.error(e.stack.toString(), 200))
        }
    }

    expressAPP.post(url, (req: Request, res: Response) => {
        _handle(res, req.body).then()
    });
    expressAPP.get(url, (req: Request, res: Response) => {
        _handle(res, req.query as any).then()
    });
    routers[url] = handle
}

for (const action  of actionHandlers) {
    registerRouter(action.actionName, (payload) => action.handle(payload))
}