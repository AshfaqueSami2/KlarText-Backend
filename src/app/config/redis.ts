import Redis from 'ioredis';
import logger from '../utils/logger';

// Redis configuration - supports both local and cloud Redis
const getRedisConfig = () => {
  // Check for Redis URL (Redis Cloud, Upstash, etc.)
  const redisUrl = process.env.REDIS_URL;
  
  if (redisUrl) {
    logger.info('☁️ Using Redis Cloud connection');
    return redisUrl;
  }
  
  // Fallback to individual config options (local Redis)
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 3) {
        logger.error('Redis connection failed after 3 retries');
        return null; // Stop retrying
      }
      const delay = Math.min(times * 200, 2000);
      return delay;
    },
    lazyConnect: true, // Don't connect immediately
  };
};

// Create Redis client
const redis = new Redis(getRedisConfig() as any);

// Connection event handlers
redis.on('connect', () => {
  logger.info('🔄 Redis connecting...');
});

redis.on('ready', () => {
  logger.info('✅ Redis connected and ready');
});

redis.on('error', (error) => {
  logger.error('❌ Redis error:', { error: error.message });
});

redis.on('close', () => {
  logger.warn('🔌 Redis connection closed');
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis reconnecting...');
});

// ============================================
// 📦 CACHE HELPER FUNCTIONS
// ============================================

/**
 * Default TTL values for different cache types (in seconds)
 */
export const CacheTTL = {
  SHORT: 60,           // 1 minute
  MEDIUM: 300,         // 5 minutes
  LONG: 3600,          // 1 hour
  DAY: 86400,          // 24 hours
  WEEK: 604800,        // 7 days
};

/**
 * Cache key prefixes for different data types
 */
export const CachePrefix = {
  USER: 'user:',
  LESSON: 'lesson:',
  STUDENT: 'student:',
  TRANSLATION: 'trans:',
  VOCABULARY: 'vocab:',
  ANALYTICS: 'analytics:',
  SESSION: 'session:',
  GRAMMAR: 'grammar:',
};

/**
 * Get cached data
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    if (data) {
      logger.debug(`Cache HIT: ${key}`);
      return JSON.parse(data) as T;
    }
    logger.debug(`Cache MISS: ${key}`);
    return null;
  } catch (error) {
    logger.error('Redis get error:', { key, error });
    return null;
  }
};

/**
 * Set cached data with TTL
 */
export const setCache = async (
  key: string,
  data: unknown,
  ttl: number = CacheTTL.MEDIUM
): Promise<boolean> => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
    logger.debug(`Cache SET: ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    logger.error('Redis set error:', { key, error });
    return false;
  }
};

/**
 * Delete cached data
 */
export const deleteCache = async (key: string): Promise<boolean> => {
  try {
    await redis.del(key);
    logger.debug(`Cache DELETE: ${key}`);
    return true;
  } catch (error) {
    logger.error('Redis delete error:', { key, error });
    return false;
  }
};

/**
 * Delete all keys matching a pattern
 */
export const deleteCachePattern = async (pattern: string): Promise<number> => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.debug(`Cache DELETE pattern: ${pattern} (${keys.length} keys)`);
    }
    return keys.length;
  } catch (error) {
    logger.error('Redis delete pattern error:', { pattern, error });
    return 0;
  }
};

/**
 * Check if key exists
 */
export const hasCache = async (key: string): Promise<boolean> => {
  try {
    return (await redis.exists(key)) === 1;
  } catch (error) {
    logger.error('Redis exists error:', { key, error });
    return false;
  }
};

/**
 * Get cache stats
 */
export const getCacheStats = async (): Promise<Record<string, unknown>> => {
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
  } catch (error) {
    logger.error('Redis stats error:', { error });
    return { connected: false, error: 'Failed to get stats' };
  }
};

/**
 * Graceful shutdown
 */
export const closeRedis = async (): Promise<void> => {
  try {
    await redis.quit();
    logger.info('Redis connection closed gracefully');
  } catch (error) {
    logger.error('Error closing Redis:', { error });
  }
};

/**
 * Get Redis client for session store
 * Returns the raw ioredis client for use with connect-redis
 */
export const getRedisClient = () => redis;

/**
 * Initialize Redis connection
 */
export const initRedis = async (): Promise<boolean> => {
  try {
    // If using URL, Redis auto-connects; if using config object with lazyConnect, we need to connect manually
    if (redis.status === 'wait') {
      await redis.connect();
    }
    
    // Wait for ready state if still connecting
    if (redis.status === 'connecting') {
      await new Promise<void>((resolve, reject) => {
        redis.once('ready', resolve);
        redis.once('error', reject);
        setTimeout(() => reject(new Error('Connection timeout')), 5000);
      });
    }
    
    // Verify connection with ping
    if (redis.status === 'ready') {
      await redis.ping();
      return true;
    }
    
    return false;
  } catch (error) {
    logger.warn('Redis not available, caching disabled:', { error: (error as Error).message });
    return false;
  }
};

export default redis;
