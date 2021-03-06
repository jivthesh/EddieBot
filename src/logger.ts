import * as pino from 'pino';
import { TextChannel } from 'discord.js';

import { client } from './client';
import config from './config';

const logger = pino({
    prettyPrint: { colorize: true },
    level: process.env.LOG_LEVEL || 'info'
});

const discordLog = async (type: string, message: string, details?: string) => {
    logger[type](message, details);

    if (config.BOT_CHANNEL_ID) {
        const channel = <TextChannel> client.channels.cache.get(config.BOT_CHANNEL_ID);

        if (!channel) {
            return logger.error('Channel not found');
        };

        await channel.send(`${type.toUpperCase()}: ${message} - ${details}`);
    }
}

export const log = {
    info: (message: string, details?: string) => discordLog('info', message, details),
    warn: (message: string, details?: string) => discordLog('warn', message, details),
    error: (message: string, details?: string) => discordLog('error', message, details),
    fatal: (message: string, details?: string) => discordLog('fatal', message, details),
}
