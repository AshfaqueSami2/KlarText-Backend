import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * Request Timeout Middleware
 * Prevents slow requests from blocking the server under high load
 * 
 * @param timeoutMs - Timeout in milliseconds (default: 30 seconds)
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set the timeout on the request
    req.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        logger.warn('Request timeout', {
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

    // Also set timeout on the response
    res.setTimeout(timeoutMs, () => {
      if (!res.headersSent) {
        logger.warn('Response timeout', {
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

/**
 * Different timeout presets for various route types
 */
export const timeouts = {
  // Fast operations (auth, simple queries)
  fast: requestTimeout(10000), // 10 seconds
  
  // Standard operations (most API calls)
  standard: requestTimeout(30000), // 30 seconds
  
  // Long operations (file uploads, TTS generation)
  long: requestTimeout(120000), // 2 minutes
  
  // Very long operations (batch processing)
  extended: requestTimeout(300000), // 5 minutes
};

export default requestTimeout;
