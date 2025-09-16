import fs from 'node:fs'
import path from 'node:path'
import JSON5 from 'json5'
import { Config, OB11Config, SatoriConfig } from './types'
import { DATA_DIR, selfInfo } from './globalVars'
import { mergeNewProperties } from './utils/misc'
import { fileURLToPath } from 'node:url'
import { defaultConfig } from '@/common/defaultConfig'

export class ConfigUtil {
  private configPath: string | undefined
  private config: Config | null = null
  private watch = false

  constructor(configPath?: string) {
    this.configPath = configPath
  }

  setConfigPath(configPath: string) {
    this.configPath = configPath
  }

  listenChange(cb: (config: Config) => void) {
    console.log('配置文件位于', this.configPath)

    this.setConfig(this.getConfig())
    if (this.configPath) {
      fs.watchFile(this.configPath, { persistent: true, interval: 1000 }, () => {
        if (!this.watch) {
          return
        }
        console.log('配置重載')
        const c = this.reloadConfig()
        cb(c)
      })
    }
  }

  getConfig(cache = true) {
    if (this.config && cache) {
      return this.config
    }

    return this.reloadConfig()
  }

  reloadConfig(): Config {
    if (this.configPath && !fs.existsSync(this.configPath)) {
      const defaultConfigPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'default_config.json')
      const defaultConfigData = fs.readFileSync(defaultConfigPath, 'utf-8')
      try {
        this.config = JSON5.parse(defaultConfigData)
      } catch (e) {
        console.error('默认配置文件 default_config.json 内容不合格，使用内置默认配置')
        this.config = defaultConfig
      }
      this.setConfig(this.config!)
      return this.config!
    }
    else {
      if (this.configPath) {
        const data = fs.readFileSync(this.configPath, 'utf-8')
        let jsonData: Config = defaultConfig
        try {
          jsonData = JSON5.parse(data)
          console.info('配置加载成功')
          mergeNewProperties(defaultConfig, jsonData)
          this.checkOldConfig(jsonData.ob11, jsonData.ob11, 'wsReverseUrls', 'wsHosts')
          this.checkOldConfig(jsonData.ob11, jsonData.ob11, 'httpPostUrls', 'httpHosts')
          this.checkOldConfig(jsonData, jsonData.ob11, 'onlyLocalhost', 'listenLocalhost')
          this.setConfig(jsonData)
          this.config = jsonData
          return this.config
        } catch (e) {
          console.error(`${this.configPath} json 内容不合格`, e)
          this.config = defaultConfig
          return this.config
        }
      }
      else {
        this.config = defaultConfig
        return this.config
      }
    }
  }

  setConfig(config: Config) {
    this.config = config
    this.writeConfig(config)
  }

  writeConfig(config: Config, watch = false) {
    if (!this.configPath) {
      return
    }
    this.watch = watch
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), 'utf-8')
    setTimeout(() => {
      this.watch = true
    }, 3000)
  }

  private checkOldConfig(
    currentConfig: Config | OB11Config | SatoriConfig,
    oldConfig: Config | OB11Config | SatoriConfig,
    currentKey: keyof OB11Config | keyof SatoriConfig | keyof Config,
    oldKey: 'http' | 'hosts' | 'wsPort' | 'wsHosts' | 'reportSelfMessage' | 'httpHosts' | 'token' | 'listenLocalhost',
  ) {
    // 迁移旧的配置到新配置，避免用户重新填写配置
    const oldValue = (oldConfig as any)[oldKey]
    if (oldValue !== undefined) {
      Object.assign(currentConfig, { [currentKey]: oldValue })
      delete (oldConfig as any)[oldKey]
    }
  }
}

let globalConfigUtil: ConfigUtil | null = null

export function getConfigUtil(force = false) {
  const configFilePath = selfInfo.uin ? path.join(DATA_DIR, `config_${selfInfo.uin}.json`) : undefined
  if (!globalConfigUtil || force) {
    globalConfigUtil = new ConfigUtil(configFilePath)
  }
  return globalConfigUtil
}

class WebUITokenUtil {
  private token: string = ''

  constructor(private readonly tokenPath: string) {
    this.tokenPath = tokenPath
  }
  getToken() {
    if (!this.token) {
      if (fs.existsSync(this.tokenPath)) {
        this.token = fs.readFileSync(this.tokenPath, 'utf-8')
      }
    }
    return this.token
  }
  setToken(token: string) {
    this.token = token.trim()
    fs.writeFileSync(this.tokenPath, token, 'utf-8')
  }
}

export const webuiTokenUtil = new WebUITokenUtil(path.join(DATA_DIR, 'webui_token.txt'))
