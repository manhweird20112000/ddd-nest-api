import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.ms(),
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.errors({ stack: true }),
    winston.format.cli(),
    utilities.format.nestLike('app', {
      colors: true,
      prettyPrint: true,
    }),
  ),
});

const transports: winston.transport[] = [consoleTransport];

// Container/prod: stdout only. Local: also rotate files under ./logs.
if (process.env.NODE_ENV !== 'production') {
  transports.unshift(
    new winston.transports.DailyRotateFile({
      filename: 'app-log-%DATE%.log',
      dirname: 'logs',
      format: winston.format.combine(winston.format.timestamp()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
      utc: true,
    }),
  );
}

export const winstonConfig: WinstonModuleOptions = {
  transports,
};
