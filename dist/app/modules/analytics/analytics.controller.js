"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsControllers = void 0;
const analytics_service_1 = require("./analytics.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_codes_1 = require("http-status-codes");
const getMyStats = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const userId = user?.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const result = await analytics_service_1.AnalyticsServices.getStudentAnalytics(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User stats fetched successfully',
        data: result,
    });
});
const getSystemStats = (0, catchAsync_1.default)(async (req, res) => {
    const result = await analytics_service_1.AnalyticsServices.getAdminStats();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'System stats fetched successfully',
        data: result,
    });
});
const getGlobalLeaderboard = (0, catchAsync_1.default)(async (req, res) => {
    const result = await analytics_service_1.AnalyticsServices.getLeaderboard();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Leaderboard fetched successfully',
        data: result,
    });
});
const getAllLessonsForAdmin = (0, catchAsync_1.default)(async (req, res) => {
    const result = await analytics_service_1.AnalyticsServices.getAllLessonsForAdmin(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'All lessons fetched successfully',
        data: result,
    });
});
exports.AnalyticsControllers = {
    getMyStats,
    getGlobalLeaderboard,
    getSystemStats,
    getAllLessonsForAdmin,
};
//# sourceMappingURL=analytics.controller.js.map