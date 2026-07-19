import winston from 'winston';
import path from 'path';
import { config } from './index';

const { combine, timestamp, json, errors, printf, colorize } = winston.format;

const devFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  if (stack) {
    msg += `\n${stack}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: config.logging.level,
  defaultMeta: { service: 'transitai-backend' },
  format: combine(
    timestamp(),
    errors({ stack: true }),
    config.env === 'development' ? devFormat : json()
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        config.env === 'development' ? devFormat : json()
      ),
    }),
  ],
});

if (config.env === 'production') {
  logger.add(
    new winston.transports.File({
      filename: path.resolve(config.logging.file),
      format: combine(timestamp(), json()),
    })
  );
  logger.add(
    new winston.transports.File({
      filename: path.resolve('logs/error.log'),
      level: 'error',
      format: combine(timestamp(), json()),
    })
  );
}

export default logger;
