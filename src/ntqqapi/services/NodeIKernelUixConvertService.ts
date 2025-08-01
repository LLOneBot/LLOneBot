export interface NodeIKernelUixConvertService {
  getUin(uids: string[]): Promise<{ uinInfo: Map<string, string> }>

  getUid(uins: string[]): Promise<{ uidInfo: Map<string, string> }>
}
