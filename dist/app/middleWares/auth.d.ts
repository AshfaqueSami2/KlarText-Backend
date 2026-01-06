import { NextFunction, Request, Response } from 'express';
import { TUserRole } from '../modules/user/user.constant';
export declare const auth: (...requiredRoles: TUserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: () => (req: Request, res: Response, next: NextFunction) => void;
export declare const conditionalAuth: () => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map