import { MilkyHttpConfig } from '@/common/types'
import type { MilkyAdapter } from '@/milky/adapter'
import { Failed } from '@/milky/common/api'
import express, { Express, Response } from 'express'
import { WebSocketServer, WebSocket } from 'ws'
import http from 'http'
import cors from 'cors'
import { Context } from 'cordis'

class MilkyHttpHandler {
  readonly app: Express
  readonly eventPushClients = new Set<WebSocket>()
  readonly sseClients = new Set<Response>() 
  
  private httpServer: http.Server | undefined
  private wsServer: WebSocketServer | undefined

  constructor(readonly milkyAdapter: MilkyAdapter, readonly ctx: Context, readonly config: MilkyHttpHandler.Config) {
    this.app = express()

    this.app.use(cors())
    this.app.use(express.json({ limit: '1024mb' }))

    // Access token middleware for API routes
    if (config.accessToken) {
      this.app.use(`${config.prefix}/api`, (req, res, next) => {
        if (req.headers['content-type'] !== 'application/json') {
          ctx.logger.warn(
            'MilkyHttp',
            `${req.ip} -> ${req.path} (Content-Type not application/json)`
          )
          return res.status(415).json(Failed(-415, 'Unsupported Media Type'))
        }

        const authorization = req.headers['authorization']
        if (!authorization || !authorization.startsWith('Bearer ')) {
          ctx.logger.warn('MilkyHttp', `${req.ip} -> ${req.path} (Credentials missing)`)
          return res.status(401).json(Failed(-401, 'Unauthorized'))
        }
        const inputToken = authorization.slice(7)

        if (inputToken !== config.accessToken) {
          ctx.logger.warn('MilkyHttp', `${req.ip} -> ${req.path} (Credentials wrong)`)
          return res.status(401).json(Failed(-401, 'Unauthorized'))
        }

        next()
      })
    }

    // SSE
    this.app.get(`${config.prefix}/event`, (req, res) => {
      // 1. 鉴权逻辑 (与 WS/API 保持一致)
      if (this.config.accessToken) {
        let inputToken = ''
        const authHeader = req.headers['authorization']
        if (authHeader && authHeader.startsWith('Bearer ')) {
          inputToken = authHeader.split('Bearer ').pop()!
        } else if (req.query.access_token) {
           // 兼容 query 参数鉴权
          inputToken = String(req.query.access_token)
        }

        if (inputToken !== this.config.accessToken) {
          this.ctx.logger.warn('MilkyHttp', `${req.ip} -> /event [SSE] (Credentials invalid)`)
          return res.status(401).json(Failed(-401, 'Unauthorized'))
        }
      }

      // 2. 设置 SSE 响应头
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache')
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('X-Accel-Buffering', 'no') // 防止 Nginx 缓存
      res.flushHeaders()

      // 3. 加入客户端列表
      this.sseClients.add(res)
      this.ctx.logger.info('MilkyHttp', `${req.ip} -> /event [SSE] (Connected)`)

      // 4. 处理断开连接
      req.on('close', () => {
        this.sseClients.delete(res)
        this.ctx.logger.info('MilkyHttp', `${req.ip} -> /event [SSE] (Disconnected)`)
      })

      req.on('error', (err) => {
        this.ctx.logger.warn('MilkyHttp', `SSE error: ${err}`)
        this.sseClients.delete(res)
      })
    })

    // API endpoint
    this.app.post(`${config.prefix}/api/:endpoint`, async (req, res) => {
      const endpoint = req.params.endpoint
      const payload = req.body

      if (!this.milkyAdapter.apiCollection.hasApi(endpoint)) {
        this.ctx.logger.warn('MilkyHttp', `${req.ip} -> ${req.path} (API not found)`)
        return res.status(404).json(Failed(404, 'API not found'))
      }

      const start = Date.now()
      const response = await this.milkyAdapter.apiCollection.handle(endpoint, payload)
      const end = Date.now()
      this.ctx.logger.info(
        'MilkyHttp',
        `${req.ip} -> ${req.path} (${response.retcode === 0 ? 'OK' : response.retcode
        } ${end - start}ms)`,
        payload
      )
      return res.json(response)
    })
  }

  start() {
    const host = this.config.onlyLocalhost ? '127.0.0.1' : '0.0.0.0'
    this.httpServer = this.app.listen(this.config.port, host, () => {
      this.ctx.logger.info(
        'MilkyHttp',
        `HTTP server started at http://127.0.0.1:${this.config.port}${this.config.prefix}`
      )
    })

    // Setup WebSocket server for event push
    this.wsServer = new WebSocketServer({
      server: this.httpServer,
      path: `${this.config.prefix}/event`,
      maxPayload: 1024 * 1024 * 1024
    })

    this.wsServer.on('connection', (ws, req) => {
      // Check access token for WebSocket connection
      if (this.config.accessToken) {
        const url = new URL(req.url!, `http://${req.headers.host}`)

        let inputToken = ''
        const authHeader = req.headers['authorization']
        if (authHeader?.toLowerCase().startsWith('bearer ')) {
          inputToken = authHeader.slice(7).trim()
          this.ctx.logger.info('receive ws header token', inputToken)
        } else {
          inputToken = url.searchParams.get('access_token') ?? ''
        }

        if (!inputToken || inputToken !== this.config.accessToken) {
          this.ctx.logger.warn('MilkyHttp', `${req.socket.remoteAddress} -> /event [WS] (Credentials invalid)`)
          ws.close(1008, 'Unauthorized')
          return
        }
      }

      this.eventPushClients.add(ws)
      this.ctx.logger.info('MilkyHttp', `${req.socket.remoteAddress} -> /event [WS] (Connected)`)

      ws.on('close', () => {
        this.eventPushClients.delete(ws)
        this.ctx.logger.info('MilkyHttp', `${req.socket.remoteAddress} -> /event [WS] (Disconnected)`)
      })

      ws.on('error', (error) => {
        this.ctx.logger.warn('MilkyHttp', `WebSocket error: ${error.message}`)
        this.eventPushClients.delete(ws)
      })
    })
  }

  stop() {
    this.sseClients.forEach(res => res.end())
    this.sseClients.clear()
    this.wsServer?.close()
    this.httpServer?.close()
  }

  broadcast(msg: string) {
    // 1. 推送给 WebSocket 客户端
    for (const ws of this.eventPushClients) {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(msg)
        }
      } catch (e) {
        this.ctx.logger.warn('MilkyHttp', `Failed to send WS message: ${e}`)
      }
    }

    // 2. 推送给 SSE 客户端
    if (this.sseClients.size > 0) {
      const sseData = `data: ${msg}\n\n`
      for (const res of this.sseClients) {
        try {
          if (!res.closed) { // 检查连接是否关闭
            res.write(sseData)
          }
        } catch (e) {
          this.ctx.logger.warn('MilkyHttp', `Failed to send SSE message: ${e}`)
        }
      }
    }
  }

  updateConfig(config: Partial<MilkyHttpHandler.Config>) {
    Object.assign(this.config, config)
  }
}

namespace MilkyHttpHandler {
  export interface Config extends MilkyHttpConfig {
    onlyLocalhost: boolean
  }
}

export { MilkyHttpHandler }
