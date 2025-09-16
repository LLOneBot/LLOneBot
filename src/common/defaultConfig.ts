import { Config, OB11Config, SatoriConfig, WebUIConfig } from '@/common/types'

const ob11Default: OB11Config = {
  enable: true,
  token: '',
  httpPort: 3000,
  httpPostUrls: [],
  httpSecret: '',
  wsPort: 3001,
  wsReverseUrls: [],
  enableHttp: true,
  enableHttpPost: true,
  enableWs: true,
  enableWsReverse: true,
  messagePostFormat: 'array',
  enableHttpHeart: false,
  reportSelfMessage: false,
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
  heartInterval: 60000,
  enableLocalFile2Url: false,
  debug: false,
  log: true,
  autoDeleteFile: false,
  autoDeleteFileSecond: 60,
  musicSignUrl: 'https://llob.linyuchen.net/sign/music',
  msgCacheExpire: 120,
  ffmpeg: '',
  receiveOfflineMsg: false,
}
