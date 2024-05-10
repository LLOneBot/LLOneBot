import * as os from 'os'
import fs from 'fs'
import path from 'node:path'
import { cpModule } from '../cpmodule'

interface MoeHook {
  GetRkey: () => string // Return '&rkey=xxx'
  HookRkey: () => string
}

class HookApi {
  private readonly moeHook: MoeHook | null = null

  constructor() {
    cpModule('MoeHoo')
    try {
      this.moeHook = require('./MoeHoo.node')
      console.log('hook rkey地址', this.moeHook!.HookRkey())
    } catch (e) {
      console.log('加载 moehoo 失败', e)
    }
  }

  getRKey(): string {
    return this.moeHook?.GetRkey() || ''
  }

  isAvailable() {
    return !!this.moeHook
  }
}

export const hookApi = new HookApi()
