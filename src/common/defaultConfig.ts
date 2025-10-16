import { Config, OB11Config, SatoriConfig, WebUIConfig } from '@/common/types'

const ob11Default: OB11Config = {
  enable: true,
  connect: [
    {
      type: 'ws',
      enable: false,
      port: 3001,
      heartInterval: 60000,
      token: '',
      reportSelfMessage: false,
      reportOfflineMessage: false,
      messageFormat: 'array',
      debug: false
    },
    {
      type: 'ws-reverse',
      enable: false,
      url: '',
      heartInterval: 60000,
      token: '',
      reportSelfMessage: false,
      reportOfflineMessage: false,
      messageFormat: 'array',
      debug: false
    },
    {
      type: 'http',
      enable: false,
      port: 3000,
      token: '',
      reportSelfMessage: false,
      reportOfflineMessage: false,
      messageFormat: 'array',
      debug: false
    },
    {
      type: 'http-post',
      enable: false,
      url: '',
      enableHeart: false,
      heartInterval: 60000,
      token: '',
      reportSelfMessage: false,
      reportOfflineMessage: false,
      messageFormat: 'array',
      debug: false
    }
  ]
}
const satoriDefault: SatoriConfig = {
  enable: false,
  port: 5600,
  token: '',
}
const webuiDefault: WebUIConfig = {
  enable: true,
  port: 3080,
}
export const defaultConfig: Config = {
  webui: webuiDefault,
  onlyLocalhost: true,
  satori: satoriDefault,
  ob11: ob11Default,
  enableLocalFile2Url: false,
  log: true,
  autoDeleteFile: false,
  autoDeleteFileSecond: 60,
  musicSignUrl: 'https://llob.linyuchen.net/sign/music',
  msgCacheExpire: 120,
  ffmpeg: '',
}
