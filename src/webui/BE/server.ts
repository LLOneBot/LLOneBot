import express, { Application, Express, NextFunction, Request, Response } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { getConfigUtil } from '@/common/config'
import { Config, WebUIConfig } from '@/common/types'
import { Server } from 'http'
import { Context, Service } from 'cordis'
import { selfInfo } from '@/common/globalVars'
import { getAvailablePort, recordPort } from '@/common/utils/port'
import { OnQRCodeLoginSucceedParameter } from '@/ntqqapi/services/NodeIKernelLoginService'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 静态文件服务，指向前端dist目录
let feDistPath = path.resolve(__dirname, 'webui/')
if (!import.meta.env) {
  feDistPath = path.join(__dirname, '../../../dist/webui/')
}

export interface WebUIServerConfig extends WebUIConfig {
  onlyLocalhost: boolean
}

export class WebUIServer extends Service {
  static inject = ['ntLoginApi']
  private server: Server | null = null
  private app: Express = express()

  constructor(ctx: Context, public config: WebUIServerConfig) {
    super(ctx)
    this.app.use(express.static(feDistPath))
    this.app.use(express.json())

    // token 校验中间件
    this.app.use('/api', (req: Request, res: Response, next: NextFunction) => {
      const config = getConfigUtil().getConfig()
      const token = config.webui?.token
      if (!token) {
        if (req.path === '/set-token') return next()
        res.status(401).json({ success: false, message: '请先设置WebUI密码' })
        return
      }
      const reqToken = req.headers['x-webui-token'] || req.body?.token || req.query?.token
      if (reqToken !== token) {
        res.status(403).json({ success: false, message: 'Token校验失败' })
        return
      }
      next()
    })

    // 获取配置接口
    this.app.get('/api/config/', (req, res) => {
      try {
        const config = getConfigUtil().getConfig()
        const { nick, uin } = selfInfo
        res.json({ success: true, data: { config, selfInfo: { nick, uin } } })
      } catch (e) {
        res.status(500).json({ success: false, message: '获取配置失败', error: String(e) })
      }
    })

    // 保存配置接口
    this.app.post('/api/config', (req, res) => {
      try {
        const config = req.body as Config
        const oldConfig = getConfigUtil().getConfig()
        const newConfig = { ...oldConfig, ...config }
        this.ctx.parallel('llob/config-updated', newConfig).then()
        getConfigUtil().setConfig(newConfig)
        res.json({ success: true, message: '配置保存成功' })
      } catch (e) {
        res.status(500).json({ success: false, message: '保存配置失败', error: String(e) })
      }
    })

    // 设置token接口
    this.app.post('/api/set-token', (req: Request, res: Response) => {
      const { token } = req.body
      if (!token) {
        res.status(400).json({ success: false, message: 'Token不能为空' })
        return
      }
      const config = getConfigUtil().getConfig()
      config.webui.token = token
      getConfigUtil().setConfig(config)
      res.json({ success: true, message: 'Token设置成功' })
    })

    // 获取账号信息接口
    this.app.get('/api/login-info', (req, res) => {
      res.json({ success: true, data: selfInfo })
    })

    // 获取登录二维码
    this.app.get('/api/login-qrcode', async (req, res) => {
      this.ctx.ntLoginApi.getLoginQrCode().then(data => {
          res.json({
            success: true,
            data,
          })
        },
      ).catch(e=>{
        res.status(500).json({ success: false, message: '获取登录二维码失败', error: String(e) })
      })
    })

    // 获取快速登录账号列表
    this.app.get('/api/quick-login-list', async (req, res) => {
      this.ctx.ntLoginApi.getQuickLoginList().then(data => {
          res.json({
            success: true,
            data,
          })
        },
      ).catch(e=>{
        res.status(500).json({ success: false, message: '获取快速登录账号列表失败', error: String(e) })
      })
    })

    // 快速登录
    this.app.post('/api/quick-login', async (req, res) => {
      const { uin } = req.body
      if (!uin) {
        res.status(400).json({ success: false, message: '没有选择QQ号' })
        return
      }
      this.ctx.ntLoginApi.quickLoginWithUin(uin).then((data) => {
          res.json({
            success: true,
            data
          })
        },
      ).catch(e=>{
        res.status(500).json({ success: false, message: '快速登录失败', error: String(e) })
      })
    })

    this.app.get('/', (req, res) => {
      res.sendFile(path.join(feDistPath, 'index.html'))
    })

    // 监听 config 更新事件
    ctx.on('llob/config-updated', (newConfig: Config) => {
      const oldConfig = { ...this.config }
      this.config = { onlyLocalhost: newConfig.onlyLocalhost, ...newConfig.webui }
      if (oldConfig.onlyLocalhost != newConfig.onlyLocalhost
        || oldConfig.enable != newConfig.webui?.enable
        || oldConfig.port != newConfig.webui?.port
      ) {
        this.ctx.logger.info('WebUI 配置已更新:', this.config)
        this.restart()
      }
    })
  }

  // Override the base Service.start() signature to match expected arguments
  async start() {
    if (!this.config?.enable) {
      return
    }

    let port = this.config.port ?? 3080
    port = await getAvailablePort(port)
    recordPort(
      selfInfo.uin,
      { webUIPort: port },
    ).catch((err: Error) => {
      this.ctx.logger.error('记录WebUI端口失败:', err)
    })
    const host = this.config.onlyLocalhost ? '127.0.0.1' : ''
    this.server = this.app.listen(port, host, () => {
      this.ctx.logger.info(`WebUI 端口: ${port}`)
    })
    this.server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        this.ctx.logger.error(`WebUI 端口 ${port} 被占用，启动失败！`)
      }
      else {
        this.ctx.logger.error('WebUI 启动失败:', err)
      }
    })
  }

  stop() {
    this.server?.close()
  }

  restart() {
    this.stop()
    this.start()
  }
}

