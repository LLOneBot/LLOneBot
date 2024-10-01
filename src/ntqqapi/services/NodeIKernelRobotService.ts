import { GeneralCallResult } from './common'

export interface NodeIKernelRobotService {
  getRobotUinRange(req: unknown): Promise<GeneralCallResult & {
    response: {
      version: number
      robotUinRanges: {
        minUin: string
        maxUin: string
      }[]
    }
  }>
}
