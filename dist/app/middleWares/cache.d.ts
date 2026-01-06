import { Request, Response, NextFunction } from 'express';
export declare const cacheMiddleware: (prefix?: string, ttl?: number) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const cache: {
    short: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    medium: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    long: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    lessons: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    vocabulary: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    translations: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    analytics: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    grammar: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
};
export declare const invalidateCache: (patterns: string[]) => (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export default cache;
//# sourceMappingURL=cache.d.ts.map