"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAuth = exports.logDatabase = exports.logError = exports.logRequest = exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../config"));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan',
};
winston_1.default.addColors(colors);
const level = () => {
    const env = config_1.default.env || 'development';
    return env === 'development' ? 'debug' : 'info';
};
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.colorize({ all: true }), winston_1.default.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}${info.stack ? '\n' + info.stack : ''}`));
const fileFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
const transports = [
    new winston_1.default.transports.Console({
        format: consoleFormat,
    }),
];
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
const isLocalDev = config_1.default.env === 'development' && !isServerless;
if (isLocalDev) {
    const logDir = path_1.default.join(process.cwd(), 'logs');
    const combinedRotateTransport = new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: fileFormat,
    });
    const errorRotateTransport = new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d',
        level: 'error',
        format: fileFormat,
    });
    const httpRotateTransport = new winston_daily_rotate_file_1.default({
        filename: path_1.default.join(logDir, 'http-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
        level: 'http',
        format: fileFormat,
    });
    transports.push(combinedRotateTransport, errorRotateTransport, httpRotateTransport);
}
const logger = winston_1.default.createLogger({
    level: level(),
    levels,
    transports,
    exitOnError: false,
});
exports.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
const logRequest = (req) => {
    logger.http('HTTP Request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userId: req.userId,
        duration: req.duration ? `${req.duration}ms` : undefined,
        statusCode: req.statusCode,
    });
};
exports.logRequest = logRequest;
const logError = (error, context) => {
    logger.error(error.message, {
        stack: error.stack,
        name: error.name,
        ...context,
    });
};
exports.logError = logError;
const logDatabase = (action, details) => {
    logger.info(`Database: ${action}`, details);
};
exports.logDatabase = logDatabase;
const logAuth = (action, userId, details) => {
    logger.info(`Auth: ${action}`, { userId, ...details });
};
exports.logAuth = logAuth;
exports.default = logger;
//# sourceMappingURL=logger.js.map