export interface QuickLoginResult {
  result: string  // 0 成功
  loginErrorInfo: {
    errMsg: string,
    proofWaterUrl: string,
    newDevicePullQrCodeSig: Uint8Array,
    jumpUrl: string,
    jumpWord: string,
    tipsTitle: string,
    tipsContent: string,
    unusualDeviceQrSig: string,
    uinToken: string
  }
}

export interface GetLoginListResult {
  result: number,
  LocalLoginInfoList: {
    uin: string,
    uid: string,
    nickname: string,
    faceUrl: string
    loginType: number,
    isQuickLogin: boolean,
    isAutoLogin: boolean
  }[]
}

export interface NodeIKernelLoginService {

  getLoginList(): Promise<GetLoginListResult>

  quickLoginWithUin(uin: string): Promise<QuickLoginResult>

  getQRCodePicture(): boolean

}
