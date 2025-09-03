import { Context, Service } from 'cordis'
import { invoke } from '@/ntqqapi/ntcall'

declare module 'cordis' {
  interface Context {
    ntLoginApi: NTLoginApi
  }
}

export class NTLoginApi extends Service {
  static inject = []

  constructor(protected ctx: Context) {
    super(ctx, 'ntLoginApi', true)
  }

  async getQuickLoginList(){
    return await invoke('nodeIKernelLoginService/getQuickLoginList', [])
  }

  async quickLoginWithUin(uin: string){
    return await invoke('nodeIKernelLoginService/quickLoginWithUin', [uin], {
    })
  }

  async getLoginQrCode(){
    return await invoke('nodeIKernelLoginService/getLoginQrCode', [], {
      resultCmd: 'nodeIKernelLoginListener/onQRCodeGetPicture'
    })
  }
}
