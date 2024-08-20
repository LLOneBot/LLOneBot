import BaseAction from '../../action/BaseAction'
import { WebSocket, WebSocketServer } from 'ws'
import { actionMap } from '../../action'
import { OB11Response } from '../../action/OB11Response'
import { postWsEvent, registerWsEventSender, unregisterWsEventSender } from '../post-ob11-event'
import { ActionName } from '../../action/types'
import { LifeCycleSubType, OB11LifeCycleEvent } from '../../event/meta/OB11LifeCycleEvent'
import { OB11HeartbeatEvent } from '../../event/meta/OB11HeartbeatEvent'
import { IncomingMessage } from 'node:http'
import { wsReply } from './reply'
import { getSelfInfo } from '@/common/data'
import { log } from '@/common/utils/log'
import { getConfigUtil } from '@/common/config'
import { llonebotError } from '@/common/data'

export class OB11WebsocketServer {
  private ws?: WebSocketServer

  constructor() {
    log(`llonebot websocket service started`)
  }

  start(port: number) {
    try {
      this.ws = new WebSocketServer({ port, maxPayload: 1024 * 1024 * 1024 })
      llonebotError.wsServerError = ''
    } catch (e: any) {
      llonebotError.wsServerError = '正向 WebSocket 服务启动失败, ' + e.toString()
      return
    }
    this.ws?.on('connection', (socket, req) => {
      const url = req.url?.split('?').shift()
      this.authorize(socket, req)
      this.onConnect(socket, url!)
    })
  }

  stop() {
    llonebotError.wsServerError = ''
    this.ws?.close(err => {
      log('ws server close failed!', err)
    })
    this.ws = undefined
  }

  restart(port: number) {
    this.stop()
    this.start(port)
  }

  private authorize(socket: WebSocket, req: IncomingMessage) {
    const { token } = getConfigUtil().getConfig()
    const url = req.url?.split('?').shift()
    log('ws connect', url)
    let clientToken = ''
    const authHeader = req.headers['authorization']
    if (authHeader) {
      clientToken = authHeader.split('Bearer ').pop()!
      log('receive ws header token', clientToken)
    } else {
      const { searchParams } = new URL(`http://localhost${req.url}`)
      const urlToken = searchParams.get('access_token')
      if (urlToken) {
        if (Array.isArray(urlToken)) {
          clientToken = urlToken[0]
        } else {
          clientToken = urlToken
        }
        log('receive ws url token', clientToken)
      }
    }
    if (token && clientToken !== token) {
      this.authorizeFailed(socket)
      return socket.close()
    }
  }

  private authorizeFailed(socket: WebSocket) {
    socket.send(JSON.stringify(OB11Response.res(null, 'failed', 1403, 'token验证失败')))
  }

  private async handleAction(socket: WebSocket, actionName: string, params: any, echo?: any) {
    const action: BaseAction<any, any> = actionMap.get(actionName)!
    if (!action) {
      return wsReply(socket, OB11Response.error('不支持的api ' + actionName, 1404, echo))
    }
    try {
      const handleResult = await action.websocketHandle(params, echo)
      handleResult.echo = echo
      wsReply(socket, handleResult)
    } catch (e: any) {
      wsReply(socket, OB11Response.error(`api处理出错:${e.stack}`, 1200, echo))
    }
  }

  private onConnect(socket: WebSocket, url: string) {
    if (['/api', '/api/', '/'].includes(url)) {
      socket.on('message', async (msg) => {
        let receiveData: { action: ActionName | null; params: any; echo?: any } = { action: null, params: {} }
        let echo: any
        try {
          receiveData = JSON.parse(msg.toString())
          echo = receiveData.echo
          log('收到正向Websocket消息', receiveData)
        } catch (e) {
          return wsReply(socket, OB11Response.error('json解析失败，请检查数据格式', 1400, echo))
        }
        this.handleAction(socket, receiveData.action!, receiveData.params, receiveData.echo)
      })
    }
    if (['/event', '/event/', '/'].includes(url)) {
      registerWsEventSender(socket)

      log('event上报ws客户端已连接')

      try {
        wsReply(socket, new OB11LifeCycleEvent(LifeCycleSubType.CONNECT))
      } catch (e) {
        log('发送生命周期失败', e)
      }
      const { heartInterval } = getConfigUtil().getConfig()
      const intervalId = setInterval(() => {
        postWsEvent(new OB11HeartbeatEvent(getSelfInfo().online!, true, heartInterval!))
      }, heartInterval) // 心跳包
      socket.on('close', () => {
        log('event上报ws客户端已断开')
        clearInterval(intervalId)
        unregisterWsEventSender(socket)
      })
    }
  }
}

export const ob11WebsocketServer = new OB11WebsocketServer()
