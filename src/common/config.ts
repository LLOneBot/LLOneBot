import {Config, OB11Config} from "./types";
import {mergeNewProperties} from "./utils";

const fs = require("fs");

export class ConfigUtil {
    configPath: string;

    constructor(configPath: string) {
        this.configPath = configPath;
    }
    getConfig(){
        try {
            return this._getConfig()
        }catch (e) {
            console.log("获取配置文件出错", e)
        }
    }
    _getConfig(): Config {
        let ob11Default: OB11Config = {
            httpPort: 3000,
            httpHosts: [],
            wsPort: 3001,
            wsHosts: [],
            enableHttp: true,
            enableHttpPost: true,
            enableWs: true,
            enableWsReverse: false
        }
        let defaultConfig: Config = {
            ob11: ob11Default,
            heartInterval: 5000,
            token: "",
            enableBase64: false,
            debug: false,
            log: false,
            reportSelfMessage: false
        }
        if (!fs.existsSync(this.configPath)) {
            return defaultConfig
        } else {
            const data = fs.readFileSync(this.configPath, "utf-8");
            let jsonData: Config = defaultConfig;
            try {
                jsonData = JSON.parse(data)
            } catch (e) {
            }
            mergeNewProperties(defaultConfig, jsonData);
            this.checkOldConfig(jsonData.ob11, jsonData, "httpPort", "port");
            this.checkOldConfig(jsonData.ob11, jsonData, "httpHosts", "hosts");
            this.checkOldConfig(jsonData.ob11, jsonData, "wsPort", "wsPort");
            console.log("get config", jsonData);
            return jsonData;
        }
    }

    setConfig(config: Config) {
        fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), "utf-8")
    }

    private checkOldConfig(currentConfig: Config | OB11Config,
                           oldConfig: Config | OB11Config,
                           currentKey: string, oldKey: string) {
        // 迁移旧的配置到新配置，避免用户重新填写配置
        const oldValue = oldConfig[oldKey];
        if (oldValue) {
            currentConfig[currentKey] = oldValue;
            delete oldConfig[oldKey];
        }
    }
}
