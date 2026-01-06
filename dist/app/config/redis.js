"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initRedis = exports.getRedisClient = exports.closeRedis = exports.getCacheStats = exports.hasCache = exports.deleteCachePattern = exports.deleteCache = exports.setCache = exports.getCache = exports.CachePrefix = exports.CacheTTL = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("../utils/logger"));
const getRedisConfig = () => {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
        logger_1.default.info('☁️ Using Redis Cloud connection');
        return redisUrl;
    }
    return {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
            if (times > 3) {
                logger_1.default.error('Redis connection failed after 3 retries');
                return null;
            }
            const delay = Math.min(times * 200, 2000);
            return delay;
        },
        lazyConnect: true,
    };
};
const redis = new ioredis_1.default(getRedisConfig());
redis.on('connect', () => {
    logger_1.default.info('🔄 Redis connecting...');
});
redis.on('ready', () => {
    logger_1.default.info('✅ Redis connected and ready');
});
redis.on('error', (error) => {
    logger_1.default.error('❌ Redis error:', { error: error.message });
});
redis.on('close', () => {
    logger_1.default.warn('🔌 Redis connection closed');
});
redis.on('reconnecting', () => {
    logger_1.default.info('🔄 Redis reconnecting...');
});
exports.CacheTTL = {
    SHORT: 60,
    MEDIUM: 300,
    LONG: 3600,
    DAY: 86400,
    WEEK: 604800,
};
exports.CachePrefix = {
    USER: 'user:',
    LESSON: 'lesson:',
    STUDENT: 'student:',
    TRANSLATION: 'trans:',
    VOCABULARY: 'vocab:',
    ANALYTICS: 'analytics:',
    SESSION: 'session:',
    GRAMMAR: 'grammar:',
};
const getCache = async (key) => {
    try {
        const data = await redis.get(key);
        if (data) {
            logger_1.default.debug(`Cache HIT: ${key}`);
            return JSON.parse(data);
        }
        logger_1.default.debug(`Cache MISS: ${key}`);
        return null;
    }
    catch (error) {
        logger_1.default.error('Redis get error:', { key, error });
        return null;
    }
};
exports.getCache = getCache;
const setCache = async (key, data, ttl = exports.CacheTTL.MEDIUM) => {
    try {
        await redis.setex(key, ttl, JSON.stringify(data));
        logger_1.default.debug(`Cache SET: ${key} (TTL: ${ttl}s)`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Redis set error:', { key, error });
        return false;
    }
};
exports.setCache = setCache;
const deleteCache = async (key) => {
    try {
        await redis.del(key);
        logger_1.default.debug(`Cache DELETE: ${key}`);
        return true;
    }
    catch (error) {
        logger_1.default.error('Redis delete error:', { key, error });
        return false;
    }
};
exports.deleteCache = deleteCache;
const deleteCachePattern = async (pattern) => {
    try {
        const keys = await redis.keys(pattern);
        if (keys.length > 0) {
            await redis.del(...keys);
            logger_1.default.debug(`Cache DELETE pattern: ${pattern} (${keys.length} keys)`);
        }
        return keys.length;
    }
    catch (error) {
        logger_1.default.error('Redis delete pattern error:', { pattern, error });
        return 0;
    }
};
exports.deleteCachePattern = deleteCachePattern;
const hasCache = async (key) => {
    try {
        return (await redis.exists(key)) === 1;
    }
    catch (error) {
        logger_1.default.error('Redis exists error:', { key, error });
        return false;
    }
};
exports.hasCache = hasCache;
const getCacheStats = async () => {
    try {
        const info = await redis.info('stats');
        const memory = await redis.info('memory');
        const keyspace = await redis.info('keyspace');
        return {
            connected: redis.status === 'ready',
            stats: info,
            memory,
            keyspace,
        };
    }
    catch (error) {
        logger_1.default.error('Redis stats error:', { error });
        return { connected: false, error: 'Failed to get stats' };
    }
};
exports.getCacheStats = getCacheStats;
const closeRedis = async () => {
    try {
        await redis.quit();
        logger_1.default.info('Redis connection closed gracefully');
    }
    catch (error) {
        logger_1.default.error('Error closing Redis:', { error });
    }
};
exports.closeRedis = closeRedis;
const getRedisClient = () => redis;
exports.getRedisClient = getRedisClient;
const initRedis = async () => {
    try {
        if (redis.status === 'wait') {
            await redis.connect();
        }
        if (redis.status === 'connecting') {
            await new Promise((resolve, reject) => {
                redis.once('ready', resolve);
                redis.once('error', reject);
                setTimeout(() => reject(new Error('Connection timeout')), 5000);
            });
        }
        if (redis.status === 'ready') {
            await redis.ping();
            return true;
        }
        return false;
    }
    catch (error) {
        logger_1.default.warn('Redis not available, caching disabled:', { error: error.message });
        return false;
    }
};
exports.initRedis = initRedis;
exports.default = redis;
//# sourceMappingURL=redis.js.map