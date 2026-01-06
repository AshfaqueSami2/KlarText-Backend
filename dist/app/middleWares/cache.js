"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.cache = exports.cacheMiddleware = void 0;
const redis_1 = require("../config/redis");
const logger_1 = __importDefault(require("../utils/logger"));
const cacheMiddleware = (prefix = '', ttl = redis_1.CacheTTL.MEDIUM) => {
    return async (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }
        const cacheKey = `${prefix}${req.originalUrl}`;
        try {
            const cachedData = await (0, redis_1.getCache)(cacheKey);
            if (cachedData) {
                logger_1.default.debug(`Serving from cache: ${cacheKey}`);
                return res.status(cachedData.statusCode).json(cachedData.data);
            }
            const originalJson = res.json.bind(res);
            res.json = ((data) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    (0, redis_1.setCache)(cacheKey, { statusCode: res.statusCode, data }, ttl).catch((err) => logger_1.default.error('Cache set error:', { error: err }));
                }
                return originalJson(data);
            });
            next();
        }
        catch (error) {
            logger_1.default.error('Cache middleware error:', { error });
            next();
        }
    };
};
exports.cacheMiddleware = cacheMiddleware;
exports.cache = {
    short: (0, exports.cacheMiddleware)('', redis_1.CacheTTL.SHORT),
    medium: (0, exports.cacheMiddleware)('', redis_1.CacheTTL.MEDIUM),
    long: (0, exports.cacheMiddleware)('', redis_1.CacheTTL.LONG),
    lessons: (0, exports.cacheMiddleware)(redis_1.CachePrefix.LESSON, redis_1.CacheTTL.LONG),
    vocabulary: (0, exports.cacheMiddleware)(redis_1.CachePrefix.VOCABULARY, redis_1.CacheTTL.DAY),
    translations: (0, exports.cacheMiddleware)(redis_1.CachePrefix.TRANSLATION, redis_1.CacheTTL.WEEK),
    analytics: (0, exports.cacheMiddleware)(redis_1.CachePrefix.ANALYTICS, redis_1.CacheTTL.SHORT),
    grammar: (0, exports.cacheMiddleware)(redis_1.CachePrefix.GRAMMAR, redis_1.CacheTTL.LONG),
};
const invalidateCache = (patterns) => {
    return async (_req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = ((data) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                Promise.resolve().then(() => __importStar(require('../config/redis'))).then(({ deleteCachePattern }) => {
                    patterns.forEach((pattern) => {
                        deleteCachePattern(pattern).catch((err) => logger_1.default.error('Cache invalidation error:', { pattern, error: err }));
                    });
                });
            }
            return originalJson(data);
        });
        next();
    };
};
exports.invalidateCache = invalidateCache;
exports.default = exports.cache;
//# sourceMappingURL=cache.js.map