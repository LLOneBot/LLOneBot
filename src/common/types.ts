export interface OB11Config {
    httpPort: number
    httpHosts: string[]
    wsPort: number
    wsHosts: string[]
    enableHttp?: boolean
    enableHttpPost?: boolean
    enableWs?: boolean
    enableWsReverse?: boolean
}

export interface Config {
    ob11: OB11Config
    token?: string
    heartInterval?: number  // ms
    enableBase64?: boolean
    debug?: boolean
    reportSelfMessage?: boolean
    log?: boolean
}