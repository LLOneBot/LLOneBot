import {Config} from "./types";

const fs = require("fs");

export class ConfigUtil{
    configPath: string;

    constructor(configPath: string) {
        this.configPath = configPath;
    }

    getConfig(): Config {
        if (!fs.existsSync(this.configPath)) {
            return {
                httpPort: 3000,
                httpHosts: ["http://127.0.0.1:5000/"],
                wsPort: 3001,
                wsHosts: ["ws://127.0.0.1:3002/"]
            }
        } else {
            const data = fs.readFileSync(this.configPath, "utf-8");
            let jsonData = JSON.parse(data);
            if (!jsonData.hosts) {
                jsonData.hosts = [];
            }
            return jsonData;
        }
    }

    setConfig(config: Config){
        fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), "utf-8");
    }
}
