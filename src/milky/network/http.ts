import { MilkyConfig } from '@/milky/common/config';
import type { MilkyAdapter } from '@/milky/adapter';
import { Failed } from '@/milky/common/api';
import express, { Express } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import cors from 'cors';

export class MilkyHttpHandler {
    readonly app: Express;
    readonly eventPushClients = new Set<WebSocket>();
    private httpServer: http.Server | undefined;
    private wsServer: WebSocketServer | undefined;

    constructor(readonly milkyAdapter: MilkyAdapter, readonly config: MilkyConfig['http']) {
        this.app = express();
        
        this.app.use(cors());
        this.app.use(express.json());

        // Access token middleware for API routes
        if (config.accessToken) {
            this.app.use(`${config.prefix}/api/*`, (req, res, next) => {
                if (req.headers['content-type'] !== 'application/json') {
                    milkyAdapter.ctx.logger.logWarn(
                        'MilkyHttp',
                        `${req.ip} -> ${req.path} (Content-Type not application/json)`
                    );
                    return res.status(415).json(Failed(-415, 'Unsupported Media Type'));
                }

                const authorization = req.headers['authorization'];
                if (!authorization || !authorization.startsWith('Bearer ')) {
                    milkyAdapter.ctx.logger.logWarn('MilkyHttp', `${req.ip} -> ${req.path} (Credentials missing)`);
                    return res.status(401).json(Failed(-401, 'Unauthorized'));
                }
                const inputToken = authorization.slice(7);

                if (inputToken !== config.accessToken) {
                    milkyAdapter.ctx.logger.logWarn('MilkyHttp', `${req.ip} -> ${req.path} (Credentials wrong)`);
                    return res.status(401).json(Failed(-401, 'Unauthorized'));
                }

                next();
            });
        }

        // API endpoint
        this.app.post(`${config.prefix}/api/:endpoint`, async (req, res) => {
            const endpoint = req.params.endpoint;
            const payload = req.body;
            
            if (!this.milkyAdapter.apiCollection.hasApi(endpoint)) {
                this.milkyAdapter.ctx.logger.logWarn('MilkyHttp', `${req.ip} -> ${req.path} (API not found)`);
                return res.status(404).json(Failed(404, 'API not found'));
            }

            const start = Date.now();
            const response = await this.milkyAdapter.apiCollection.handle(endpoint, payload);
            const end = Date.now();
            this.milkyAdapter.ctx.logger.logInfo(
                'MilkyHttp',
                `${req.ip} -> ${req.path} (${
                    response.retcode === 0 ? 'OK' : response.retcode
                } ${end - start}ms)`
            );
            return res.json(response);
        });
    }

    start() {
        this.httpServer = this.app.listen(this.config.port, this.config.host, () => {
            this.milkyAdapter.ctx.logger.logInfo(
                'MilkyHttp',
                `HTTP server started at http://${this.config.host}:${this.config.port}${this.config.prefix}`
            );
        });

        // Setup WebSocket server for event push
        this.wsServer = new WebSocketServer({ 
            server: this.httpServer,
            path: `${this.config.prefix}/event`
        });

        this.wsServer.on('connection', (ws, req) => {
            // Check access token for WebSocket connection
            if (this.config.accessToken) {
                const url = new URL(req.url!, `http://${req.headers.host}`);
                const inputToken = url.searchParams.get('access_token');

                if (!inputToken || inputToken !== this.config.accessToken) {
                    this.milkyAdapter.ctx.logger.logWarn('MilkyHttp', `${req.socket.remoteAddress} -> /event (Credentials invalid)`);
                    ws.close(1008, 'Unauthorized');
                    return;
                }
            }

            this.eventPushClients.add(ws);
            this.milkyAdapter.ctx.logger.logInfo('MilkyHttp', `${req.socket.remoteAddress} -> /event (Connected)`);

            ws.on('close', () => {
                this.eventPushClients.delete(ws);
                this.milkyAdapter.ctx.logger.logInfo('MilkyHttp', `${req.socket.remoteAddress} -> /event (Disconnected)`);
            });

            ws.on('error', (error) => {
                this.milkyAdapter.ctx.logger.logWarn('MilkyHttp', `WebSocket error: ${error.message}`);
                this.eventPushClients.delete(ws);
            });
        });
    }

    stop() {
        this.wsServer?.close();
        this.httpServer?.close();
    }

    broadcast(msg: string) {
        for (const ws of this.eventPushClients) {
            try {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(msg);
                }
            } catch (e) {
                this.milkyAdapter.ctx.logger.logWarn('MilkyHttp', `Failed to send message: ${e}`);
            }
        }
    }
}

