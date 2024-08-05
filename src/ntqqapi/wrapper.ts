import path from 'node:path'
import fs from 'node:fs'
import { qqPkgInfo } from '../common/utils/QQBasicInfo'
import { NodeIKernelBuddyService } from './services/NodeIKernelBuddyService'

export interface NodeIQQNTWrapperSession {
  [key: string]: any
  new(): NodeIQQNTWrapperSession
  getBuddyService(): NodeIKernelBuddyService
}

export interface WrapperNodeApi {
  [key: string]: any
  NodeIQQNTWrapperSession: NodeIQQNTWrapperSession
}

let wrapperNodePath = path.resolve(path.dirname(process.execPath), './resources/app/wrapper.node')
if (!fs.existsSync(wrapperNodePath)) {
  wrapperNodePath = path.join(path.dirname(process.execPath), `resources/app/versions/${qqPkgInfo.version}/wrapper.node`)
}
const nativemodule: any = { exports: {} }
process.dlopen(nativemodule, wrapperNodePath)
const wrapperApi: WrapperNodeApi = nativemodule.exports

export { wrapperApi }
export default wrapperApi