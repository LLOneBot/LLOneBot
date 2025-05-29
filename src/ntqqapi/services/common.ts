export enum GeneralCallResultStatus {
  OK = 0
}

export interface GeneralCallResult {
  errMsg: string
  errCode?: GeneralCallResultStatus
  result: GeneralCallResultStatus | any
}
