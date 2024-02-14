export interface Config {
    httpPort: number
    httpHosts: string[]
    wsPort: number
    wsHosts: string[]
    enableHttp?: boolean
    enableHttpPost?: boolean
    enableWs?: boolean
    enableWsReverse?: boolean
    enableBase64?: boolean
    debug?: boolean
    reportSelfMessage?: boolean
    log?: boolean
}