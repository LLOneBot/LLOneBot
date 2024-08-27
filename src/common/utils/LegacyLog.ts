import fs from 'fs'
import path from 'node:path'
import { truncateString } from './index'
import { getConfigUtil } from '../config'
import { LOG_DIR } from '../globalVars'

export const logFileName = `llonebot-${new Date().toLocaleString('zh-CN')}.log`.replace(/\//g, '-').replace(/:/g, '-')

export function log(...msg: any[]) {
  if (!getConfigUtil().getConfig().log) {
    return
  }
  let logMsg = ''
  for (const msgItem of msg) {
    // 判断是否是对象
    if (typeof msgItem === 'object') {
      logMsg += JSON.stringify(truncateString(msgItem)) + ' '
      continue
    }
    logMsg += msgItem + ' '
  }
  const currentDateTime = new Date().toLocaleString()
  logMsg = `${currentDateTime} ${logMsg}\n\n`
  fs.appendFile(path.join(LOG_DIR, logFileName), logMsg, () => { })
}
