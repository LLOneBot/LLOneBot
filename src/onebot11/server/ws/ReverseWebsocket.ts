import {getConfigUtil, log} from "../../../common/utils";

import * as WebSocket from "ws";
import {selfInfo} from "../../../common/data";
import {LifeCycleSubType, OB11LifeCycleEvent} from "../../event/meta/OB11LifeCycleEvent";
import {ActionName} from "../../action/types";
import {OB11WebsocketResponse} from "../../action/utils";
import BaseAction from "../../action/BaseAction";
import {actionMap} from "../../action";
import {registerWsEventSender, unregisterWsEventSender} from "../postevent";
import {wsReply} from "./reply";

export let rwsList: ReverseWebsocket[] = [];

export class ReverseWebsocket {
    public websocket: WebSocket.WebSocket;
    public url: string;
    private running: boolean = false;

    public constructor(url: string) {
        this.url = url;
        this.running = true;
        this.connect();
    }
    public stop(){
        this.running = false;
        unregisterWsEventSender(this.websocket);
        this.websocket.close();
    }

    public onopen = function () {
    }

    public onmessage = function (msg: string) {
    }

    public onclose = function () {
        unregisterWsEventSender(this.websocket);
    }

    public send(msg: string) {
        if (this.websocket && this.websocket.readyState == WebSocket.OPEN) {
            this.websocket.send(msg);
        }
    }

    private reconnect() {
        setTimeout(() => {
            this.connect();
        }, 3000);  // TODO: 重连间隔在配置文件中实现
    }

    private connect() {
        const {token} = getConfigUtil().getConfig()
        this.websocket = new WebSocket.WebSocket(this.url, {
            handshakeTimeout: 2000,
            perMessageDeflate: false,
            headers: {
                'X-Self-ID': selfInfo.uin,
                'Authorization': `Bearer ${token}`
            }
        });
        log("Trying to connect to the websocket server: " + this.url);

        const instance = this;

        this.websocket.on("open", function open() {
            log("Connected to the websocket server: " + instance.url);
            instance.onopen();
        });

        this.websocket.on("message", function message(data) {
            instance.onmessage(data.toString());
        });

        this.websocket.on("error", log);

        this.websocket.on("close", function close() {
            log("The websocket connection: " + instance.url + " closed, trying reconnecting...");
            instance.onclose();

            if (instance.running) {
                instance.reconnect();
            }
        });
    }
}

class OB11ReverseWebsockets {
    start() {
        for (const url of getConfigUtil().getConfig().ob11.wsHosts) {
            log("开始连接反向ws", url)
            new Promise(() => {
                try {
                    let rwsClient = new ReverseWebsocket(url);
                    rwsList.push(rwsClient);
                    registerWsEventSender(rwsClient.websocket);

                    rwsClient.onopen = function () {
                        wsReply(rwsClient.websocket, new OB11LifeCycleEvent(LifeCycleSubType.CONNECT));
                    }

                    rwsClient.onclose = function () {
                        log("反向ws断开", url);
                        unregisterWsEventSender(rwsClient.websocket);
                    }

                    rwsClient.onmessage = async function (msg) {
                        let receiveData: { action: ActionName, params: any, echo?: string } = {action: null, params: {}}
                        let echo = ""
                        log("收到反向Websocket消息", msg.toString())
                        try {
                            receiveData = JSON.parse(msg.toString())
                            echo = receiveData.echo
                        } catch (e) {
                            return wsReply(rwsClient.websocket, OB11WebsocketResponse.error("json解析失败，请检查数据格式", 1400, echo))
                        }
                        const action: BaseAction<any, any> = actionMap.get(receiveData.action);
                        if (!action) {
                            return wsReply(rwsClient.websocket, OB11WebsocketResponse.error("不支持的api " + receiveData.action, 1404, echo))
                        }
                        try {
                            let handleResult = await action.websocketHandle(receiveData.params, echo);
                            wsReply(rwsClient.websocket, handleResult)
                        } catch (e) {
                            wsReply(rwsClient.websocket, OB11WebsocketResponse.error(`api处理出错:${e}`, 1200, echo))
                        }
                    }
                } catch (e) {
                    log(e.stack);
                }
            }).then();
        }
    }

    stop() {
        for(let rws of rwsList){
            rws.stop();
        }
    }

    restart() {
        this.stop();
        this.start();
    }
}

export const ob11ReverseWebsockets = new OB11ReverseWebsockets();

