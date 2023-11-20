import {Config} from "../common/types";

const fs = require("fs")

export class ConfigUtil{
    configPath: string;

    constructor(configPath: string) {
        this.configPath = configPath;
    }

    getConfig(): Config{
        if (!fs.existsSync(this.configPath)) {
            return {"port":3000, "host": "http://localhost:5000/"}
        } else {
            const data = fs.readFileSync(this.configPath, "utf-8");
            return JSON.parse(data);
        }
    }
}
