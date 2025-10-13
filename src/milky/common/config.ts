import { z } from 'zod';

export const zProfile = z.object({
    name: z.string(),
});
export type Profile = z.infer<typeof zProfile>;

export const defaultProfile: Profile = {
    name: 'default',
};

const zLogLevel = z.enum(['debug', 'info', 'warn', 'error', 'fatal']);

export const zMilkyConfig = z.object({
    enable: z.boolean(),
    logging: z.object({
        console: z.object({
            enable: z.boolean(),
            level: zLogLevel,
        }),
        file: z.object({
            enable: z.boolean(),
            level: zLogLevel,
        }),
    }),
    reportSelfMessage: z.boolean(),
    http: z.object({
        host: z.string(),
        port: z.number().int().min(1).max(65535),
        prefix: z.string(),
        accessToken: z.string(),
    }),
    webhook: z.object({
        urls: z.array(z.string().url()),
    }),
});

export type MilkyConfig = z.infer<typeof zMilkyConfig>;

export const defaultMilkyConfig: MilkyConfig = {
    enable: false,
    logging: {
        console: {
            enable: true,
            level: 'info',
        },
        file: {
            enable: true,
            level: 'info',
        },
    },
    reportSelfMessage: true,
    http: {
        host: '0.0.0.0',
        port: 3001,
        prefix: '/milky',
        accessToken: '',
    },
    webhook: {
        urls: []
    }
};

