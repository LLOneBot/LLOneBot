import {Response} from "express";
import {OB11Response} from "../action/OB11Response";
import {HttpServerBase} from "../../common/server/http";
import {actionHandlers} from "../action";
import {getConfigUtil} from "../../common/config";

class OB11HTTPServer extends HttpServerBase {
    name = "OneBot V11 server"

    handleFailed(res: Response, payload: any, e: any) {
        res.send(OB11Response.error(e.stack.toString(), 200))
    }

    protected listen(port: number) {
        if (getConfigUtil().getConfig().ob11.enableHttp) {
            super.listen(port);
        }
    }
}

export const ob11HTTPServer = new OB11HTTPServer();

setTimeout(() => {
    for (const action of actionHandlers) {
        for (const method of ["post", "get"]) {
            ob11HTTPServer.registerRouter(method, action.actionName, (res, payload) => action.handle(payload))
        }
    }
}, 0)