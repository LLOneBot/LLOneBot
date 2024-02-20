import * as websocket from "ws";
import {OB11WebsocketResponse} from "../../action/utils";
import {PostEventType} from "../postevent";
import {log} from "../../../common/utils";

export function wsReply(wsClient: websocket.WebSocket, data: OB11WebsocketResponse | PostEventType) {
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