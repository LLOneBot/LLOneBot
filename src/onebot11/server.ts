import * as websocket from "ws";
import urlParse from "url";
import {getConfigUtil, log} from "../common/utils";
import {selfInfo} from "../common/data";
import {OB11Message} from './types';
import {actionMap} from "./action";
import {OB11WebsocketResponse} from "./action/utils";
import {callEvent, registerEventSender, unregisterEventSender} from "./event/manager";
import {ReconnectingWebsocket} from "./ReconnectingWebsocket";
import {ActionName} from "./action/types";
import {OB11BaseMetaEvent} from "./event/meta/OB11BaseMetaEvent";
import {OB11BaseNoticeEvent} from "./event/notice/OB11BaseNoticeEvent";
import BaseAction from "./action/BaseAction";
import {LifeCycleSubType, OB11LifeCycleEvent} from "./event/meta/OB11LifeCycleEvent";
import {OB11HeartbeatEvent} from "./event/meta/OB11HeartbeatEvent";

let heartbeatRunning = false;
let websocketServer = null;

export function initWebsocket(port: number) {
    const {heartInterval, ob11: {enableWs}, token} = getConfigUtil().getConfig()
    if (!heartbeatRunning) {
        setInterval(() => {
            callEvent(new OB11HeartbeatEvent(true, true, heartInterval));
        }, heartInterval);  // 心跳包

        heartbeatRunning = true;
    }
    if (enableWs) {
        if (websocketServer) {
            websocketServer.close((err) => {
                log("ws server close failed!", err)
            })
        }

        websocketServer = new websocket.Server({port});
        console.log(`llonebot websocket service started 0.0.0.0:${port}`);

        websocketServer.on("connection", (ws, req) => {
            const url = req.url.split("?").shift();
            log("receive ws connect", url)
            let clientToken: string = ""
            const authHeader = req.headers['authorization'];
            if (authHeader) {
                clientToken = authHeader.split("Bearer ").pop()
                log("receive ws header token", clientToken);
            } else {
                const parsedUrl = urlParse.parse(req.url, true);
                const urlToken = parsedUrl.query.access_token;
                if (urlToken) {
                    if (Array.isArray(urlToken)) {
                        clientToken = urlToken[0]
                    } else {
                        clientToken = urlToken
                    }
                    log("receive ws url token", clientToken);
                }
            }
            if (token && clientToken != token) {
                ws.send(JSON.stringify(OB11WebsocketResponse.res(null, "failed", 1403, "token验证失败")))
                return ws.close()
            }

            if (url == "/api" || url == "/api/" || url == "/") {
                ws.on("message", async (msg) => {
                    let receiveData: { action: ActionName, params: any, echo?: string } = {action: null, params: {}}
                    let echo = ""
                    log("收到正向Websocket消息", msg.toString())
                    try {
                        receiveData = JSON.parse(msg.toString())
                        echo = receiveData.echo
                    } catch (e) {
                        return wsReply(ws, OB11WebsocketResponse.error("json解析失败，请检查数据格式", 1400, echo))
                    }
                    const action: BaseAction<any, any> = actionMap.get(receiveData.action);
                    if (!action) {
                        return wsReply(ws, OB11WebsocketResponse.error("不支持的api " + receiveData.action, 1404, echo))
                    }
                    try {
                        let handleResult = await action.websocketHandle(receiveData.params, echo);
                        wsReply(ws, handleResult)
                    } catch (e) {
                        wsReply(ws, OB11WebsocketResponse.error(`api处理出错:${e}`, 1200, echo))
                    }
                })
            }
            if (url == "/event" || url == "/event/" || url == "/") {
                registerEventSender(ws);

                log("event上报ws客户端已连接")

                try {
                    wsReply(ws, new OB11LifeCycleEvent(LifeCycleSubType.CONNECT))
                } catch (e) {
                    log("发送生命周期失败", e)
                }

                ws.on("close", () => {
                    log("event上报ws客户端已断开")
                    unregisterEventSender(ws);
                })
            }
        })
    }

    initReverseWebsocket();
}

function initReverseWebsocket() {
    const config = getConfigUtil().getConfig();
    if (config.ob11.enableWsReverse) {
        console.log("Prepare to connect all reverse websockets...");
        for (const url of config.ob11.wsHosts) {
            new Promise(() => {
                try {
                    let wsClient = new ReconnectingWebsocket(url);
                    registerEventSender(wsClient);

                    wsClient.onopen = function () {
                        wsReply(wsClient, new OB11LifeCycleEvent(LifeCycleSubType.CONNECT));
                    }

                    wsClient.onclose = function () {
                        unregisterEventSender(wsClient);
                    }

                    wsClient.onmessage = async function (msg) {
                        let receiveData: { action: ActionName, params: any, echo?: string } = {action: null, params: {}}
                        let echo = ""
                        log("收到反向Websocket消息", msg.toString())
                        try {
                            receiveData = JSON.parse(msg.toString())
                            echo = receiveData.echo
                        } catch (e) {
                            return wsReply(wsClient, OB11WebsocketResponse.error("json解析失败，请检查数据格式", 1400, echo))
                        }
                        const action: BaseAction<any, any> = actionMap.get(receiveData.action);
                        if (!action) {
                            return wsReply(wsClient, OB11WebsocketResponse.error("不支持的api " + receiveData.action, 1404, echo))
                        }
                        try {
                            let handleResult = await action.websocketHandle(receiveData.params, echo);
                            wsReply(wsClient, handleResult)
                        } catch (e) {
                            wsReply(wsClient, OB11WebsocketResponse.error(`api处理出错:${e}`, 1200, echo))
                        }
                    }
                } catch (e) {
                    log(e.stack);
                }
            }).then();
        }
    }
}

export function wsReply(wsClient: websocket.WebSocket | ReconnectingWebsocket, data: OB11WebsocketResponse | PostMsgType) {
    try {
        let packet = Object.assign({
            echo: ""
        }, data);
        if (!packet.echo) {
            packet.echo = "";
        }

        wsClient.send(JSON.stringify(packet))
        log("ws 消息上报", data)
    } catch (e) {
        log("websocket 回复失败", e)
    }
}

export type PostMsgType = OB11Message | OB11BaseMetaEvent | OB11BaseNoticeEvent

export function postMsg(msg: PostMsgType) {
    const config = getConfigUtil().getConfig();
    // 判断msg是否是event
    if (!config.reportSelfMessage) {
        if ((msg as OB11Message).user_id.toString() == selfInfo.uin) {
            return
        }
    }
    for (const host of config.ob11.httpHosts) {
        fetch(host, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-self-id": selfInfo.uin
            },
            body: JSON.stringify(msg)
        }).then((res: any) => {
            log(`新消息事件HTTP上报成功: ${host} ` + JSON.stringify(msg));
        }, (err: any) => {
            log(`新消息事件HTTP上报失败: ${host} ` + err + JSON.stringify(msg));
        });
    }

    log("新消息事件ws上报", msg);
    callEvent(msg);
}
