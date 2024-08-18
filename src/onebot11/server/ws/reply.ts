import { WebSocket as WebSocketClass } from 'ws'
import { PostEventType } from '../post-ob11-event'
import { log } from '@/common/utils/log'
import { OB11Return } from '../../types'

export function wsReply(wsClient: WebSocketClass, data: OB11Return<any> | PostEventType) {
  try {
    wsClient.send(JSON.stringify(data))
    if (data['post_type']) {
      log('WebSocket 事件上报', wsClient.url ?? '', data['post_type'])
    }
  } catch (e: any) {
    log('WebSocket 上报失败', e.stack, data)
  }
}
