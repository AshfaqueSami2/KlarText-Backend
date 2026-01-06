"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
const loginUser = async (req, res) => {
    try {
        const result = await auth_service_1.AuthServices.loginUser(req.body);
        const { refreshToken, accessToken } = result;
        res.cookie('refreshToken', refreshToken, {
            secure: config_1.default.env === 'development',
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: 'User is logged in successfully!',
            data: {
                accessToken,
            },
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const logoutUser = async (req, res) => {
    try {
        const result = await auth_service_1.AuthServices.logoutUser();
        res.clearCookie('refreshToken', {
            secure: config_1.default.env === 'production',
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: 'User logged out successfully!',
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.redirect(`${config_1.default.client_url}/auth/error?message=Authentication failed`);
        }
        const result = await auth_service_1.AuthServices.googleAuthSuccess(user);
        const { refreshToken, accessToken } = result;
        res.cookie('refreshToken', refreshToken, {
            secure: config_1.default.env === 'production',
            httpOnly: true,
        });
        const redirectUrl = `${config_1.default.client_url}/auth/success?token=${accessToken}&student_id=${result.user.student?.id || ''}`;
        res.redirect(redirectUrl);
    }
    catch (err) {
        console.error('❌ Google OAuth Callback Error:', err);
        res.redirect(`${config_1.default.client_url}/auth/error?message=${encodeURIComponent(err.message)}`);
    }
};
const googleFailure = (req, res) => {
    res.redirect(`${config_1.default.client_url}/auth/error?message=Google authentication failed`);
};
exports.AuthControllers = {
    loginUser,
    logoutUser,
    googleCallback,
    googleFailure,
};
//# sourceMappingURL=auth.controller.js.map