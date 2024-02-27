import BaseAction from "./BaseAction";
import {ActionName} from "./types";
import {NTQQApi} from "../../ntqqapi/ntcall";
import fs from "fs";
import Path from "path";
import {
    ChatType,
    ChatCacheListItemBasic
} from '../../ntqqapi/types';

export default class CleanCache extends BaseAction<void, void> {
    actionName = ActionName.CleanCache

    protected _handle(): Promise<void> {
        console.log('Start scanning cache...');
        return new Promise<void>(async (res, rej) => {
            try {
                const cacheFilePaths: string[] = [];

                await NTQQApi.setCacheSilentScan(false);

                cacheFilePaths.push((await NTQQApi.getHotUpdateCachePath()));
                cacheFilePaths.push((await NTQQApi.getDesktopTmpPath()));
                (await NTQQApi.getCacheSessionPathList()).forEach(e => cacheFilePaths.push(e.value));

                // await NTQQApi.addCacheScannedPaths(); // XXX: 调用就崩溃，原因目前还未知
                const cacheScanResult = await NTQQApi.scanCache();
                const cacheSize = parseInt(cacheScanResult.size[6]);

                if (cacheScanResult.result !== 0) {
                    throw('Something went wrong while scanning cache. Code: ' + cacheScanResult.result);
                }

                await NTQQApi.setCacheSilentScan(true);
                if (cacheSize > 0 && cacheFilePaths.length > 2) { // 存在缓存文件且大小不为 0 时执行清理动作
                    console.log('Cleaning cache...');
                    // await NTQQApi.clearCache([ 'tmp', 'hotUpdate', ...cacheScanResult ]) // XXX: 也是调用就崩溃，调用 fs 删除得了
                    deleteCachePath(cacheFilePaths);
                }

                // 清理聊天记录
                // NOTE: 以防有人不需要删除聊天记录，暂时先注释掉，日后加个开关
                // await clearChatCache(ChatType.PRIVATE); // 私聊消息
                // await clearChatCache(ChatType.GROUP); // 群聊消息



                res();
            } catch(e) {
                console.error('清理缓存时发生了错误');
                rej(e);
            }
        });
    }
}

function deleteCachePath(pathList: string[]) {
    const emptyPath = (path: string) => {
        if (!fs.existsSync(path)) return;
        const files = fs.readdirSync(path);
        files.forEach(file => {
            const filePath = Path.resolve(path, file);
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) emptyPath(filePath);
            else fs.unlinkSync(filePath);
        });
        fs.rmdirSync(path);
    }

    for (const path of pathList) {
        emptyPath(path);
    }
}

async function clearChatCache(type: ChatType) {
    const cacheList = await getCacheList(type);
    return NTQQApi.clearChatCache(cacheList, []);
}

function getCacheList(type: ChatType) { // NOTE: 做这个方法主要是因为目前还不支持针对频道消息的清理
    return new Promise<Array<ChatCacheListItemBasic>>((res, rej) => {
        NTQQApi.getChatCacheList(type, 1000, 0)
            .then(data => {
                console.log(data);
                const list = data.infos.filter(e => e.chatType === type && parseInt(e.basicChatCacheInfo.chatSize) > 0);
                const result = list.map(e => {
                    const result = { ...e.basicChatCacheInfo };
                    result.chatType = type;
                    result.isChecked = true;
                    return result;
                });
                res(result);
            })
            .catch(e => rej(e));
    });
}