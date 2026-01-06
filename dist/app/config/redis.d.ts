import Redis from 'ioredis';
declare const redis: Redis;
export declare const CacheTTL: {
    SHORT: number;
    MEDIUM: number;
    LONG: number;
    DAY: number;
    WEEK: number;
};
export declare const CachePrefix: {
    USER: string;
    LESSON: string;
    STUDENT: string;
    TRANSLATION: string;
    VOCABULARY: string;
    ANALYTICS: string;
    SESSION: string;
    GRAMMAR: string;
};
export declare const getCache: <T>(key: string) => Promise<T | null>;
export declare const setCache: (key: string, data: unknown, ttl?: number) => Promise<boolean>;
export declare const deleteCache: (key: string) => Promise<boolean>;
export declare const deleteCachePattern: (pattern: string) => Promise<number>;
export declare const hasCache: (key: string) => Promise<boolean>;
export declare const getCacheStats: () => Promise<Record<string, unknown>>;
export declare const closeRedis: () => Promise<void>;
export declare const getRedisClient: () => Redis;
export declare const initRedis: () => Promise<boolean>;
export default redis;
//# sourceMappingURL=redis.d.ts.map