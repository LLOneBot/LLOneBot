import { Context, Service } from 'cordis'
import { invoke } from '@/ntqqapi/ntcall'

declare module 'cordis' {
  interface Context {
    ntSystemApi: NTQQSystemApi
  }
}

export class NTQQSystemApi extends Service {
  constructor(protected ctx: Context) {
    super(ctx, 'ntSystemApi', true)
  }

  async restart() {
    // todo: 调用此接口后会将 NTQQ 设置里面的自动登录和无需手机确认打开，重启后将状态恢复到之前的状态

    // 设置自动登录
    await this.setSettingAutoLogin(true)
    // 退出账号
    // invoke('quitAccount', []).then()
    // invoke('notifyQQClose', [{ type: 1 }]).then()
    // // 等待登录界面，模拟点击登录按钮？还是直接调用登录方法？
  }

  async getSettingAutoLogin() {
    // 查询是否自动登录
    return invoke('nodeIKernelNodeMiscService/queryAutoRun', [])
  }

  async setSettingAutoLogin(state: boolean) {
    await invoke<unknown>('nodeIKernelSettingService/setNeedConfirmSwitch', [1] ) // 1：不需要手机确认，2：需要手机确认

    await invoke<unknown>('nodeIKernelSettingService/setAutoLoginSwitch', [state])
  }
}
