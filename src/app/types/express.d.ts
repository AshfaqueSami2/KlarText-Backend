import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface User {
      userId: string;
      role: string;
    }
    
    interface Request {
      user?: User;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload | User;
}