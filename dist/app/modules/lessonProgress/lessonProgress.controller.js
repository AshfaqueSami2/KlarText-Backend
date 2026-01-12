"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonProgressControllers = void 0;
const lessonProgress_service_1 = require("./lessonProgress.service");
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const markComplete = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.body;
    const user = req.user;
    const userId = user?.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const result = await lessonProgress_service_1.LessonProgressServices.markLessonAsComplete(userId, lessonId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Lesson marked as complete! +10 Coins',
        data: result,
    });
});
const reviewLesson = (0, catchAsync_1.default)(async (req, res) => {
    const lessonId = req.params.lessonId;
    const user = req.user;
    const userId = user?.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const result = await lessonProgress_service_1.LessonProgressServices.reviewCompletedLesson(userId, lessonId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Lesson content retrieved for review',
        data: result,
    });
});
const getMyProgress = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const userId = user?.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const result = await lessonProgress_service_1.LessonProgressServices.getStudentProgress(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Student progress retrieved successfully',
        data: result,
    });
});
const getAvailableLessons = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const userId = user?.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const result = await lessonProgress_service_1.LessonProgressServices.getAvailableLessons(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Available lessons retrieved successfully',
        data: result,
    });
});
exports.LessonProgressControllers = {
    markComplete,
    reviewLesson,
    getMyProgress,
    getAvailableLessons
};
//# sourceMappingURL=lessonProgress.controller.js.map