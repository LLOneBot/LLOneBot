import { Config } from '@/common/types'
import { SelfInfo } from '@/ntqqapi/types'

export interface ResConfig{
  token: string,
  config: Config,
  selfInfo: SelfInfo
}

export interface ReqConfig extends Omit<ResConfig, 'selfInfo'> {}
