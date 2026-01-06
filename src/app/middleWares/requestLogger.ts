import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Middleware to log all HTTP requests
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
      userId: (req as Request & { user?: { _id?: string } }).user?._id,
    };

    // Use different log levels based on status code
    if (res.statusCode >= 500) {
      logger.error('HTTP Request Failed', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('HTTP Request Client Error', logData);
    } else {
      logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    }
  });

  next();
};

export default requestLogger;
