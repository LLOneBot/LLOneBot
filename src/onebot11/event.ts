import {selfInfo} from "../common/data";

const websocketList = [];

export enum EventType {
    META = "meta_event",
    REQUEST = "request",
    NOTICE = "notice",
    MESSAGE = "message"
}

export function registerEventSender(ws) {
    websocketList.push(ws);
}

export function unregisterEventSender(ws) {
    let index = websocketList.indexOf(ws);
    if (index !== -1) {
        websocketList.splice(index, 1);
    }
}

export function callEvent<DataType>(type: EventType, data: DataType) {
    const basicEvent = {
        time: new Date().getTime(),
        self_id: selfInfo.uin,
        post_type: type
    }


    for (const ws of websocketList) {
        ws.send(
            JSON.stringify(
                Object.assign(basicEvent, data)
            )
        );
    }
}