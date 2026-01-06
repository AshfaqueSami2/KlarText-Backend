"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeouts = exports.requestTimeout = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const requestTimeout = (timeoutMs = 30000) => {
    return (req, res, next) => {
        req.setTimeout(timeoutMs, () => {
            if (!res.headersSent) {
                logger_1.default.warn('Request timeout', {
                    method: req.method,
                    url: req.originalUrl,
                    timeout: `${timeoutMs}ms`,
                    ip: req.ip,
                });
                res.status(408).json({
                    success: false,
                    message: 'Request timeout. Please try again.',
                });
            }
        });
        res.setTimeout(timeoutMs, () => {
            if (!res.headersSent) {
                logger_1.default.warn('Response timeout', {
                    method: req.method,
                    url: req.originalUrl,
                    timeout: `${timeoutMs}ms`,
                });
                res.status(408).json({
                    success: false,
                    message: 'Request timeout. Please try again.',
                });
            }
        });
        next();
    };
};
exports.requestTimeout = requestTimeout;
exports.timeouts = {
    fast: (0, exports.requestTimeout)(10000),
    standard: (0, exports.requestTimeout)(30000),
    long: (0, exports.requestTimeout)(120000),
    extended: (0, exports.requestTimeout)(300000),
};
exports.default = exports.requestTimeout;
//# sourceMappingURL=timeout.js.map