import { MilkyConfig } from '@/milky/common/config';
import type { MilkyAdapter } from '@/milky/adapter';

export class MilkyWebhookHandler {
    constructor(readonly milkyAdapter: MilkyAdapter, readonly config: MilkyConfig['webhook']) {}

    async broadcast(msg: string) {
        if (this.config.urls.length === 0) {
            return;
        }
        const sendResult = await Promise.allSettled(this.config.urls.map(async (url) => {
            try {
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: msg,
                });
            } catch (e) {
                this.milkyAdapter.ctx.logger.logWarn(
                    'MilkyWebhook',
                    `Failed to send message to ${url}: ${e instanceof Error ? e.stack : e}`
                );
                throw e;
            }
        }));
        this.milkyAdapter.ctx.logger.logDebug(
            'MilkyWebhook',
            `Broadcasted message to ${sendResult.filter(result => result.status === 'fulfilled').length} URLs`
        );
    }
}

