export interface OB11Config {
  httpPort: number
  httpHosts: string[]
  wsPort: number
  wsHosts: string[]
  enableHttp?: boolean
  enableHttpPost?: boolean
  enableWs?: boolean
  enableWsReverse?: boolean
  messagePostFormat?: 'array' | 'string'
}
export interface CheckVersion {
  result: boolean,
  version: string
}
export interface Config {
  ob11: OB11Config
  token?: string
  heartInterval?: number // ms
  enableLocalFile2Url?: boolean // 开启后，本地文件路径图片会转成http链接, 语音会转成base64
  debug?: boolean
  reportSelfMessage?: boolean
  log?: boolean
  autoDeleteFile?: boolean
  autoDeleteFileSecond?: number
  ffmpeg?: string // ffmpeg路径
  enablePoke?: boolean
}

export interface LLOneBotError {
  ffmpegError?: string
  otherError?: string
}

export interface FileCache {
  fileName: string
  filePath: string
  fileSize: string
  url?: string
  downloadFunc?: () => Promise<void>
}
