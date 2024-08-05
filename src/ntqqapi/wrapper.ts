import { NodeIKernelBuddyService } from './services/NodeIKernelBuddyService'
import os from 'node:os'
const Process = require('node:process')

export interface NodeIQQNTWrapperSession {
  [key: string]: any
  getBuddyService(): NodeIKernelBuddyService
}

export interface WrapperNodeApi {
  [key: string]: any
  NodeIQQNTWrapperSession?: NodeIQQNTWrapperSession
}

export const wrapperApi: WrapperNodeApi = {}

Process.dlopenOrig = Process.dlopen

Process.dlopen = function (module, filename, flags = os.constants.dlopen.RTLD_LAZY) {
  const dlopenRet = this.dlopenOrig(module, filename, flags)
  for (let export_name in module.exports) {
    module.exports[export_name] = new Proxy(module.exports[export_name], {
      construct: (target, args, _newTarget) => {
        const ret = new target(...args)
        if (export_name === 'NodeIQQNTWrapperSession') wrapperApi.NodeIQQNTWrapperSession = ret
        return ret
      },
    })
  }
  return dlopenRet
}