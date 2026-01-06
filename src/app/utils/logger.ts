import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import config from '../config';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'cyan',
};

winston.addColors(colors);

// Determine log level based on environment
const level = () => {
  const env = config.env || 'development';
  return env === 'development' ? 'debug' : 'info';
};

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// Format for file output (JSON for easier parsing)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Log directory
const logDir = path.join(process.cwd(), 'logs');

// Daily rotate file transport for combined logs
const combinedRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d', // Keep logs for 14 days
  format: fileFormat,
});

// Daily rotate file transport for error logs only
const errorRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d', // Keep error logs for 30 days
  level: 'error',
  format: fileFormat,
});

// Daily rotate file transport for HTTP request logs
const httpRotateTransport = new DailyRotateFile({
  filename: path.join(logDir, 'http-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '7d', // Keep HTTP logs for 7 days
  level: 'http',
  format: fileFormat,
});

// Define transports array
const transports: winston.transport[] = [
  // Console transport (always enabled)
  new winston.transports.Console({
    format: consoleFormat,
  }),
];

// Add file transports only in non-test environments
if (config.env !== 'test') {
  transports.push(combinedRotateTransport, errorRotateTransport, httpRotateTransport);
}

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  // Don't exit on handled exceptions
  exitOnError: false,
});

// Handle transport errors
combinedRotateTransport.on('error', (error) => {
  console.error('Error in combined log transport:', error);
});

errorRotateTransport.on('error', (error) => {
  console.error('Error in error log transport:', error);
});

// Stream for Morgan HTTP logging (if needed later)
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Helper functions for structured logging
export const logRequest = (req: {
  method: string;
  url: string;
  ip?: string;
  userId?: string;
  duration?: number;
  statusCode?: number;
}) => {
  logger.http('HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.userId,
    duration: req.duration ? `${req.duration}ms` : undefined,
    statusCode: req.statusCode,
  });
};

export const logError = (error: Error, context?: Record<string, unknown>) => {
  logger.error(error.message, {
    stack: error.stack,
    name: error.name,
    ...context,
  });
};

export const logDatabase = (action: string, details?: Record<string, unknown>) => {
  logger.info(`Database: ${action}`, details);
};

export const logAuth = (action: string, userId?: string, details?: Record<string, unknown>) => {
  logger.info(`Auth: ${action}`, { userId, ...details });
};

export default logger;
