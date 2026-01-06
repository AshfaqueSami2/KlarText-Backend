"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionalAuth = exports.optionalAuth = exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
const user_constant_1 = require("../modules/user/user.constant");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this route',
            });
        }
        const token = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : authHeader;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
            const { userId, role } = decoded;
            const user = await user_model_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'This user is not found!',
                });
            }
            if (user.isDeleted) {
                return res.status(403).json({
                    success: false,
                    message: 'This user is deleted!',
                });
            }
            if (requiredRoles && !requiredRoles.includes(role)) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to access this resource',
                });
            }
            req.user = { userId, role };
            next();
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: 'You are not authorized',
            });
        }
    });
};
exports.auth = auth;
const optionalAuth = () => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            try {
                const token = authHeader.startsWith('Bearer ')
                    ? authHeader.slice(7)
                    : authHeader;
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
                const { userId, role } = decoded;
                const user = await user_model_1.User.findById(userId);
                if (user && !user.isDeleted) {
                    req.user = { userId, role };
                }
            }
            catch (error) {
            }
        }
        next();
    });
};
exports.optionalAuth = optionalAuth;
const conditionalAuth = () => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const authHeader = req.headers.authorization;
        let isAuthenticated = false;
        let userRole = null;
        if (authHeader) {
            try {
                const token = authHeader.startsWith('Bearer ')
                    ? authHeader.slice(7)
                    : authHeader;
                const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
                const { userId, role } = decoded;
                const user = await user_model_1.User.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                if (user.isDeleted) {
                    throw new Error('User is deleted');
                }
                userRole = role;
                isAuthenticated = true;
                req.user = { userId, role };
            }
            catch (error) {
                isAuthenticated = false;
            }
        }
        const isAdminCreation = req.path === '/create-admin';
        if (isAdminCreation) {
            if (!isAuthenticated || userRole !== user_constant_1.USER_ROLE.ADMIN) {
                return res.status(403).json({
                    success: false,
                    message: 'Only admins can create other admins.',
                });
            }
        }
        else {
            if (isAuthenticated && userRole === user_constant_1.USER_ROLE.STUDENT) {
                return res.status(403).json({
                    success: false,
                    message: 'Students cannot create other users. Only admins can create users.',
                });
            }
            if (isAuthenticated && userRole !== user_constant_1.USER_ROLE.ADMIN && userRole !== user_constant_1.USER_ROLE.STUDENT) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid user role for this operation.',
                });
            }
        }
        req.authInfo = {
            isAuthenticated,
            userRole
        };
        next();
    });
};
exports.conditionalAuth = conditionalAuth;
//# sourceMappingURL=auth.js.map