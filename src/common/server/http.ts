import express, {Express, json, Request, Response} from "express";
import http from "http";
import {log} from "../utils/log";
import {getConfigUtil} from "../config";

type RegisterHandler = (res: Response, payload: any) => Promise<any>

export abstract class HttpServerBase {
    name: string = "LLOneBot";
    private readonly expressAPP: Express;
    private server: http.Server = null;

    constructor() {
        this.expressAPP = express();
        this.expressAPP.use(express.urlencoded({extended: true, limit: "5000mb"}));
        this.expressAPP.use((req, res, next) => {
            // 兼容处理没有带content-type的请求
            // log("req.headers['content-type']", req.headers['content-type'])
            req.headers['content-type'] = 'application/json';
            const originalJson = express.json({limit: "5000mb"});
            // 调用原始的express.json()处理器
            originalJson(req, res, (err) => {
                if (err) {
                    log("Error parsing JSON:", err);
                    return res.status(400).send("Invalid JSON");
                }
                next();
            });
        });
    }

    authorize(req: Request, res: Response, next: () => void) {
        let serverToken = getConfigUtil().getConfig().token;
        let clientToken = ""
        const authHeader = req.get("authorization")
        if (authHeader) {
            clientToken = authHeader.split("Bearer ").pop()
            log("receive http header token", clientToken)
        } else if (req.query.access_token) {
            if (Array.isArray(req.query.access_token)) {
                clientToken = req.query.access_token[0].toString();
            } else {
                clientToken = req.query.access_token.toString();
            }
            log("receive http url token", clientToken)
        }

        if (serverToken && clientToken != serverToken) {
            return res.status(403).send(JSON.stringify({message: 'token verify failed!'}));
        }
        next();
    };

    start(port: number) {
        this.expressAPP.get('/', (req: Request, res: Response) => {
            res.send(`${this.name}已启动`);
        })
        this.listen(port);
    }

    stop() {
        if (this.server) {
            this.server.close()
            this.server = null;
        }
    }

    restart(port: number) {
        this.stop()
        this.start(port)
    }

    abstract handleFailed(res: Response, payload: any, err: any): void

    registerRouter(method: "post" | "get" | string, url: string, handler: RegisterHandler) {
        if (!url.startsWith("/")) {
            url = "/" + url
        }

        if (!this.expressAPP[method]) {
            const err = `${this.name} register router failed，${method} not exist`;
            log(err);
            throw err;
        }
        this.expressAPP[method](url, this.authorize, async (req: Request, res: Response) => {
            let payload = req.body;
            if (method == "get") {
                payload = req.query
            }
            log("收到http请求", url, payload);
            try {
                res.send(await handler(res, payload))
            } catch (e) {
                this.handleFailed(res, payload, e.stack.toString())
            }
        });
    }

    protected listen(port: number) {
        this.server = this.expressAPP.listen(port, "0.0.0.0", () => {
            const info = `${this.name} started 0.0.0.0:${port}`
            console.log(info);
            log(info);
        });
    }
}