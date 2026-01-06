"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_constant_1 = require("../user/user.constant");
const analytics_controller_1 = require("./analytics.controller");
const auth_1 = require("../../middleWares/auth");
const router = express_1.default.Router();
router.get('/dashboard', (0, auth_1.auth)(user_constant_1.USER_ROLE.STUDENT), analytics_controller_1.AnalyticsControllers.getMyStats);
router.get('/leaderboard', analytics_controller_1.AnalyticsControllers.getGlobalLeaderboard);
router.get('/admin-stats', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN), analytics_controller_1.AnalyticsControllers.getSystemStats);
router.get('/admin-lessons', (0, auth_1.auth)(user_constant_1.USER_ROLE.ADMIN), analytics_controller_1.AnalyticsControllers.getAllLessonsForAdmin);
exports.AnalyticsRoutes = router;
//# sourceMappingURL=analytics.route.js.map