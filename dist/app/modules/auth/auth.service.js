"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const loginUser = async (payload) => {
    const user = await user_model_1.User.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new Error('User does not exist!');
    }
    if (user.isDeleted) {
        throw new Error('This user is deleted!');
    }
    if (!user.password) {
        throw new Error('User has no password set (Google OAuth user). Please use Google Sign-In.');
    }
    const isPasswordMatched = await user.isPasswordMatched(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new Error('Password do not match');
    }
    const jwtPayload = {
        userId: user._id.toString(),
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user.needsPasswordChange,
    };
};
const logoutUser = async () => {
    return {
        message: 'Logged out successfully'
    };
};
const googleAuthSuccess = async (user) => {
    const jwtPayload = {
        userId: user._id.toString(),
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            student: user.student,
        },
        authMethod: 'google',
        needsPasswordChange: false,
        message: 'Google authentication successful! Welcome to KlarText! 🎉',
    };
};
exports.AuthServices = {
    loginUser,
    logoutUser,
    googleAuthSuccess,
};
//# sourceMappingURL=auth.service.js.map