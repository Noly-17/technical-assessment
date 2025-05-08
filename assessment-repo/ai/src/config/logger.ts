import pino from 'pino';
import { config } from './environment';

export const logger = pino({
  level: config.logging.level,
  transport:
    config.server.nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
  redact: ['req.headers.authorization'],
});

export default logger;
