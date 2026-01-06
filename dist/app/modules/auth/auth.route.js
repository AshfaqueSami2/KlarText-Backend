"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const passport_1 = __importDefault(require("../../config/passport"));
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
router.post('/logout', auth_controller_1.AuthControllers.logoutUser);
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/auth/google/failure' }), auth_controller_1.AuthControllers.googleCallback);
router.get('/google/failure', auth_controller_1.AuthControllers.googleFailure);
router.get('/oauth-debug', (req, res) => {
    const config = require('../../config').default;
    res.json({
        message: 'OAuth Configuration Check',
        google: {
            clientId: config.google?.client_id ? '✅ Configured' : '❌ Missing',
            clientSecret: config.google?.client_secret ? '✅ Configured' : '❌ Missing',
            callbackUrl: config.google?.callback_url || '❌ Missing',
        },
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});
exports.AuthRoutes = router;
//# sourceMappingURL=auth.route.js.map