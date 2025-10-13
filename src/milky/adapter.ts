import { Context, Service } from 'cordis';
import { MilkyConfig } from './common/config';
import { MilkyApiCollection } from './common/api';
import { MilkyHttpHandler } from './network/http';
import { MilkyWebhookHandler } from './network/webhook';
import { MilkyEventTypes } from './common/event';
import { SystemApi } from './api/system';
import { MessageApi } from './api/message';
import { FriendApi } from './api/friend';
import { GroupApi } from './api/group';
import { FileApi } from './api/file';
import path from 'node:path';
import { writeFile, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { TEMP_DIR } from '@/common/globalVars';

declare module 'cordis' {
    interface Context {
        milky: MilkyAdapter;
    }
}

export class MilkyAdapter extends Service {
    static inject = ['ntUserApi', 'ntFriendApi', 'ntGroupApi', 'ntMsgApi', 'ntFileApi'];

    readonly apiCollection!: MilkyApiCollection;
    readonly httpHandler!: MilkyHttpHandler;
    readonly webhookHandler!: MilkyWebhookHandler;

    constructor(ctx: Context, public config: MilkyConfig) {
        super(ctx, 'milky', true);

        if (!config.enable) {
            ctx.logger.info('Milky adapter is disabled');
            return;
        }

        this.apiCollection = new MilkyApiCollection(ctx, [
            ...SystemApi,
            ...MessageApi,
            ...FriendApi,
            ...GroupApi,
            ...FileApi,
        ]);

        this.httpHandler = new MilkyHttpHandler(this, config.http);
        this.webhookHandler = new MilkyWebhookHandler(this, config.webhook);

        ctx.logger.info('Milky adapter initialized');
    }


    async start() {
        if (!this.config.enable) {
            return;
        }

        this.httpHandler.start();
        this.setupEventListeners();

        this.ctx.logger.info('Milky adapter started');
    }

    async stop() {
        if (!this.config.enable) {
            return;
        }

        this.httpHandler.stop();
        this.ctx.logger.info('Milky adapter stopped');
    }

    emitEvent<E extends keyof MilkyEventTypes>(eventName: E, data: MilkyEventTypes[E]) {
        const selfInfo = (this.ctx as any).ntUserApi?.selfInfo;
        const selfUin = selfInfo?.uin || '0';
        const eventString = JSON.stringify({
            time: Math.floor(Date.now() / 1000),
            self_id: parseInt(selfUin),
            event_type: eventName,
            data: data,
        });
        this.httpHandler.broadcast(eventString);
        this.webhookHandler.broadcast(eventString);
    }

    async saveToTempFile(buffer: Buffer, prefix: string): Promise<string> {
        const tempPath = path.join(TEMP_DIR, `${prefix}-${randomUUID()}`);
        await writeFile(tempPath, buffer);
        return tempPath;
    }

    async deleteTempFile(filePath: string): Promise<void> {
        try {
            await unlink(filePath);
        } catch (error) {
            this.ctx.logger.warn('Failed to delete temp file:', error);
        }
    }

    private setupEventListeners() {
        // Event listeners would be set up here based on the actual LLOneBot event system
        // For now, this is a placeholder for future implementation
        this.ctx.logger.info('Milky event listeners set up');
    }
}

export default MilkyAdapter;

