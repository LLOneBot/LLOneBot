import { BaseAction } from '../BaseAction'
import { ActionName } from '../types'

interface Payload {
  method: string
  args: unknown[]
}

export default class Debug extends BaseAction<Payload, unknown> {
  actionName = ActionName.Debug

  protected async _handle(payload: Payload) {
    this.ctx.logger.info('debug call ntqq api', payload)
    const { ntMsgApi, ntFileApi, ntFileCacheApi, ntFriendApi, ntGroupApi, ntUserApi } = this.ctx
    const ntqqApi = [ntMsgApi, ntFriendApi, ntGroupApi, ntUserApi, ntFileApi, ntFileCacheApi]
    for (const ntqqApiClass of ntqqApi) {
      const method = ntqqApiClass[payload.method as keyof typeof ntqqApiClass]
      if (method && method instanceof Function) {
        const result = await method.apply(ntqqApiClass, payload.args)
        this.ctx.logger.info('debug', result)
        return result
      }
    }
    throw `${payload.method}方法 不存在`
  }
}
