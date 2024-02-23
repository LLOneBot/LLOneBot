import {getConfigUtil, log} from "../../../common/utils";

import * as WebSocket from "ws";
import {selfInfo} from "../../../common/data";
import {LifeCycleSubType, OB11LifeCycleEvent} from "../../event/meta/OB11LifeCycleEvent";
import {ActionName} from "../../action/types";
import {OB11Response} from "../../action/utils";
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

    public stop() {
        this.running = false;
        this.websocket.close();
    }

    public onopen() {
        wsReply(this.websocket, new OB11LifeCycleEvent(LifeCycleSubType.CONNECT));
    }

    public async onmessage(msg: string) {
        let receiveData: { action: ActionName, params: any, echo?: any } = {action: null, params: {}}
        let echo = null
        try {
            receiveData = JSON.parse(msg.toString())
            echo = receiveData.echo
            log("收到反向Websocket消息", receiveData)
        } catch (e) {
            return wsReply(this.websocket, OB11Response.error("json解析失败，请检查数据格式", 1400, echo))
        }
        const action: BaseAction<any, any> = actionMap.get(receiveData.action);
        if (!action) {
            return wsReply(this.websocket, OB11Response.error("不支持的api " + receiveData.action, 1404, echo))
        }
        try {
            let handleResult = await action.websocketHandle(receiveData.params, echo);
            wsReply(this.websocket, handleResult)
        } catch (e) {
            wsReply(this.websocket, OB11Response.error(`api处理出错:${e}`, 1200, echo))
        }
    }

    public onclose = function () {
        log("反向ws断开", this.url);
        unregisterWsEventSender(this.websocket);
        if (this.running) {
            this.reconnect();
        }
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
                'Authorization': `Bearer ${token}`,
                'x-client-role': 'Universal',  // koishi-adapter-onebot 需要这个字段
            }
        });
        registerWsEventSender(this.websocket);
        log("Trying to connect to the websocket server: " + this.url);


        this.websocket.on("open", () => {
            log("Connected to the websocket server: " + this.url);
            this.onopen();
        });

        this.websocket.on("message", async (data) => {
            await this.onmessage(data.toString());
        });

        this.websocket.on("error", log);

        this.websocket.on("close", () => {
            log("The websocket connection: " + this.url + " closed, trying reconnecting...");
            this.onclose();
        });
    }
}

class OB11ReverseWebsockets {
    start() {
        for (const url of getConfigUtil().getConfig().ob11.wsHosts) {
            log("开始连接反向ws", url)
            new Promise(() => {
                try {
                    rwsList.push(new ReverseWebsocket(url));
                } catch (e) {
                    log(e.stack);
                }
            }).then();
        }
    }

    stop() {
        for (let rws of rwsList) {
            rws.stop();
        }
    }

    restart() {
        this.stop();
        this.start();
    }
}

export const ob11ReverseWebsockets = new OB11ReverseWebsockets();

