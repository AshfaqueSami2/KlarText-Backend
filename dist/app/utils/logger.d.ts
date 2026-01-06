import winston from 'winston';
declare const logger: winston.Logger;
export declare const stream: {
    write: (message: string) => void;
};
export declare const logRequest: (req: {
    method: string;
    url: string;
    ip?: string;
    userId?: string;
    duration?: number;
    statusCode?: number;
}) => void;
export declare const logError: (error: Error, context?: Record<string, unknown>) => void;
export declare const logDatabase: (action: string, details?: Record<string, unknown>) => void;
export declare const logAuth: (action: string, userId?: string, details?: Record<string, unknown>) => void;
export default logger;
//# sourceMappingURL=logger.d.ts.map