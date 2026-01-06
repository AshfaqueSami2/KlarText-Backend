import { Request, Response, NextFunction } from 'express';
import { getCache, setCache, CacheTTL, CachePrefix } from '../config/redis';
import logger from '../utils/logger';

/**
 * Cache middleware factory
 * Creates middleware that caches GET request responses
 */
export const cacheMiddleware = (
  prefix: string = '',
  ttl: number = CacheTTL.MEDIUM
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Build cache key from URL and query params
    const cacheKey = `${prefix}${req.originalUrl}`;

    try {
      // Try to get from cache
      const cachedData = await getCache<{
        statusCode: number;
        data: unknown;
      }>(cacheKey);

      if (cachedData) {
        logger.debug(`Serving from cache: ${cacheKey}`);
        return res.status(cachedData.statusCode).json(cachedData.data);
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to cache response
      res.json = ((data: unknown) => {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, { statusCode: res.statusCode, data }, ttl).catch(
            (err) => logger.error('Cache set error:', { error: err })
          );
        }
        return originalJson(data);
      }) as Response['json'];

      next();
    } catch (error) {
      logger.error('Cache middleware error:', { error });
      next();
    }
  };
};

/**
 * Pre-built cache middlewares for common use cases
 */
export const cache = {
  // Short cache for frequently changing data (1 min)
  short: cacheMiddleware('', CacheTTL.SHORT),

  // Medium cache for semi-static data (5 min)
  medium: cacheMiddleware('', CacheTTL.MEDIUM),

  // Long cache for rarely changing data (1 hour)
  long: cacheMiddleware('', CacheTTL.LONG),

  // Specific caches with prefixes
  lessons: cacheMiddleware(CachePrefix.LESSON, CacheTTL.LONG),
  vocabulary: cacheMiddleware(CachePrefix.VOCABULARY, CacheTTL.DAY),
  translations: cacheMiddleware(CachePrefix.TRANSLATION, CacheTTL.WEEK),
  analytics: cacheMiddleware(CachePrefix.ANALYTICS, CacheTTL.SHORT),
  grammar: cacheMiddleware(CachePrefix.GRAMMAR, CacheTTL.LONG),
};

/**
 * Cache invalidation middleware
 * Clears related cache entries after mutations
 */
export const invalidateCache = (patterns: string[]) => {
  return async (_req: Request, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to invalidate cache after successful mutation
    res.json = ((data: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Import dynamically to avoid circular dependency
        import('../config/redis').then(({ deleteCachePattern }) => {
          patterns.forEach((pattern) => {
            deleteCachePattern(pattern).catch((err) =>
              logger.error('Cache invalidation error:', { pattern, error: err })
            );
          });
        });
      }
      return originalJson(data);
    }) as Response['json'];

    next();
  };
};

export default cache;
