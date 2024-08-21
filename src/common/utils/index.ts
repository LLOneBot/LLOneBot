import path from 'node:path'

export * from './file'
export * from './helper'
export * from './log'
export * from './qqlevel'
export * from './QQBasicInfo'
export * from './upgrade'
export const DATA_DIR: string = global.LiteLoader.plugins['LLOneBot'].path.data
export const TEMP_DIR: string = path.join(DATA_DIR, 'temp')
export const PLUGIN_DIR: string = global.LiteLoader.plugins['LLOneBot'].path.plugin
export { getVideoInfo } from './video'
export { checkFfmpeg } from './video'
export { encodeSilk } from './audio'