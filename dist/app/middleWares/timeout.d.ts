import { Request, Response, NextFunction } from 'express';
export declare const requestTimeout: (timeoutMs?: number) => (req: Request, res: Response, next: NextFunction) => void;
export declare const timeouts: {
    fast: (req: Request, res: Response, next: NextFunction) => void;
    standard: (req: Request, res: Response, next: NextFunction) => void;
    long: (req: Request, res: Response, next: NextFunction) => void;
    extended: (req: Request, res: Response, next: NextFunction) => void;
};
export default requestTimeout;
//# sourceMappingURL=timeout.d.ts.map