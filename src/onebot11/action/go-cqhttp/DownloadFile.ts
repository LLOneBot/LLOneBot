import BaseAction from "../BaseAction";
import {ActionName} from "../types";
import fs from "fs";
import {join as joinPath} from "node:path";
import {calculateFileMD5, DATA_DIR} from "../../../common/utils";

interface Payload {
    thread_count?: number
    url?: string
    base64?: string
    name?: string
    headers?: string | string[]
}

interface FileResponse {
    file: string
}

const localPath = joinPath(DATA_DIR, "file_cache")
export default class GoCQHTTPDownloadFile extends BaseAction<Payload, FileResponse> {
    actionName = ActionName.GoCQHTTP_DownloadFile

    constructor() {
        super();
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath)
        }
    }

    protected async _handle(payload: Payload): Promise<FileResponse> {
        let name = payload.name || "";
        const isRandomName = !payload.name

        if (isRandomName) {
            do {
                name = this.generateRandomString(10);
                // 使用循环防止极低概率的情况下随机出已有的文件, 导致覆盖
            } while (fs.existsSync(joinPath(localPath, name)));
        }

        const filePath = joinPath(localPath, name);

        if (payload.base64) {
            fs.writeFileSync(filePath, payload.base64, 'base64')
        } else if (payload.url) {
            const headers = this.getHeaders(payload.headers);

            const result = await fetch(payload.url, {headers})
            if (! result.ok) throw new Error(`下载文件失败: ${result.statusText}`)

            const blob = await result.blob();
            let buffer = await blob.arrayBuffer();
            fs.writeFileSync(filePath, Buffer.from(buffer), 'binary');
        } else {
            throw new Error("不存在任何文件, 无法下载")
        }
        if (fs.existsSync(filePath)) {

            if (isRandomName) {
                // 默认实现要名称未填写时文件名为文件 md5
                const md5 = await calculateFileMD5(filePath);
                const newPath = joinPath(localPath, md5);
                fs.renameSync(filePath, newPath);
                return { file: newPath }
            }
            return { file: filePath }
        } else {
            throw new Error("文件写入失败, 检查权限")
        }
    }

    generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }
        return randomString;
    }

    getHeaders(headersIn?: string | string[]): any {
        const headers = {};
        if (typeof headersIn == 'string') {
            headersIn = headersIn.split('[\\r\\n]');
        }
        if (Array.isArray(headersIn)) {
            for (const headerItem of headersIn) {
                const spilt = headerItem.indexOf('=');
                if (spilt < 0) {
                    headers[headerItem] = "";
                } else {
                    const key = headerItem.substring(0, spilt);
                    headers[key] = headerItem.substring(0, spilt + 1);
                }
            }
        }
        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/octet-stream';
        }
        return headers;
    }
}