import { Context } from 'cordis'

interface ServerRkeyData {
  group_rkey: string
  private_rkey: string
  expired_time: number
}

export class RkeyManager {
  private serverUrl: string = ''
  private rkeyData: ServerRkeyData = {
    group_rkey: '',
    private_rkey: '',
    expired_time: 0
  }

  constructor(protected ctx: Context, serverUrl: string) {
    this.serverUrl = serverUrl
  }

  async getRkey() {
    if (this.isExpired()) {
      try {
        await this.refreshRkey()
      } catch (e) {
        this.ctx.logger.error('获取rkey失败', e)
      }
    }
    return this.rkeyData
  }

  isExpired(): boolean {
    const now = new Date().getTime() / 1000
    return now > this.rkeyData.expired_time
  }

  async refreshRkey() {
    this.rkeyData = await this.fetchServerRkey()
  }

  async fetchServerRkey(): Promise<ServerRkeyData> {
    const response = await fetch(this.serverUrl)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    return response.json()
  }
}
