let Process = require('process')
let os = require('os')
Process.dlopenOrig = Process.dlopen

export const wrapperApi: any = {}

Process.dlopen = function(module, filename, flags = os.constants.dlopen.RTLD_LAZY) {
  let dlopenRet = this.dlopenOrig(module, filename, flags)
  for (let export_name in module.exports) {
    module.exports[export_name] = new Proxy(module.exports[export_name], {
      construct: (target, args, _newTarget) => {
        let ret = new target(...args)
        if (export_name === 'NodeIQQNTWrapperSession') wrapperApi.NodeIQQNTWrapperSession = ret
        return ret
      },
    })
  }
  return dlopenRet
}
