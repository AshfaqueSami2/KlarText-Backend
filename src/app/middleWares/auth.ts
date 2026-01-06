import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';
import { USER_ROLE, TUserRole } from '../modules/user/user.constant';
import catchAsync from '../utils/catchAsync';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Check if token is provided
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized to access this route',
      });
    }

    // Extract token
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
      const { userId, role } = decoded;

      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'This user is not found!',
        });
      }

      // Check if user is deleted
      if (user.isDeleted) {
        return res.status(403).json({
          success: false,
          message: 'This user is deleted!',
        });
      }

      // Check if user has required role
      if (requiredRoles && !requiredRoles.includes(role)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource',
        });
      }

      req.user = { userId, role } as Express.User;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'You are not authorized',
      });
    }
  });
};

/**
 * Optional authentication middleware
 * Extracts user info if token is provided, but doesn't block unauthenticated requests
 * Use this for routes that work for both authenticated and unauthenticated users
 */
export const optionalAuth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      try {
        const token = authHeader.startsWith('Bearer ')
          ? authHeader.slice(7)
          : authHeader;
        
        const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
        const { userId, role } = decoded;

        // Verify user exists and is not deleted
        const user = await User.findById(userId);
        if (user && !user.isDeleted) {
          req.user = { userId, role } as Express.User;
        }
      } catch (error) {
        // Token is invalid, continue as unauthenticated
      }
    }

    next();
  });
};

export const conditionalAuth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    let isAuthenticated = false;
    let userRole = null;

    // Check if user is authenticated
    if (authHeader) {
      try {
        const token = authHeader.startsWith('Bearer ')
          ? authHeader.slice(7)
          : authHeader;
        
        const decoded = jwt.verify(token, config.jwt.secret as string) as JwtPayload;
        const { userId, role } = decoded;

        // Verify user exists and is not deleted
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        if (user.isDeleted) {
          throw new Error('User is deleted');
        }

        userRole = role;
        isAuthenticated = true;
        req.user = { userId, role } as Express.User;
      } catch (error) {
        // Token is invalid, treat as unauthenticated
        isAuthenticated = false;
      }
    }

    // Check the route to determine logic
    const isAdminCreation = req.path === '/create-admin';
    
    if (isAdminCreation) {
      // Admin creation: Only existing admins can create new admins
      if (!isAuthenticated || userRole !== USER_ROLE.ADMIN) {
        return res.status(403).json({
          success: false,
          message: 'Only admins can create other admins.',
        });
      }
    } else {
      // User creation logic:
      // 1. If no token -> allow (self-registration for students)
      // 2. If admin token -> allow (admin can create students)
      // 3. If student token -> deny (students cannot create other users)
      
      if (isAuthenticated && userRole === USER_ROLE.STUDENT) {
        return res.status(403).json({
          success: false,
          message: 'Students cannot create other users. Only admins can create users.',
        });
      }

      if (isAuthenticated && userRole !== USER_ROLE.ADMIN && userRole !== USER_ROLE.STUDENT) {
        return res.status(403).json({
          success: false,
          message: 'Invalid user role for this operation.',
        });
      }
    }

    // Store auth info for controller use
    (req as any).authInfo = {
      isAuthenticated,
      userRole
    };

    next();
  });
};