export interface NodeIKernelNodeMiscService {
  wantWinScreenOCR(url: string): Promise<{
    code: number
    errMsg: string
    result: {
      text: string
      [key: `pt${number}`]: {
        x: string
        y: string
      }
      charBox: {
        charText: string
        charBox: {
          [key: `pt${number}`]: {
            x: string
            y: string
          }
        }
      }[]
      score: string
    }[]
  }>

  queryAutoRun(): Promise<boolean>
}
