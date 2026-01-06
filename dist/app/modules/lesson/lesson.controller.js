"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonControllers = void 0;
const lesson_service_1 = require("./lesson.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("../../utils/cloudinary");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const createLesson = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not authenticated');
    }
    let coverImageUrl = '';
    if (req.file) {
        try {
            console.log('Lesson cover image received:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
            const fileName = `lesson_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            console.log('Uploading lesson cover to Cloudinary with filename:', fileName);
            const uploadResult = await (0, cloudinary_1.uploadImageToCloudinary)(req.file.buffer, fileName, 'klartext/lessons');
            coverImageUrl = uploadResult.secure_url;
            console.log('Lesson cover Cloudinary upload successful:', coverImageUrl);
        }
        catch (error) {
            console.error('Lesson cover Cloudinary upload error:', error);
        }
    }
    const lessonData = {
        ...req.body,
        coverImage: coverImageUrl,
        admin: req.user.userId
    };
    const result = await lesson_service_1.LessonServices.createLessonIntoDB(lessonData);
    const responseData = {
        ...result.toObject(),
        audioUrl: result.audioUrl || null,
        audioStatus: result.audioStatus || 'pending',
        message: result.isPublished ? 'Lesson created successfully. Audio generation started.' : 'Lesson created successfully.'
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        success: true,
        message: result.isPublished ? "Lesson created and audio generation started" : "Lesson created successfully",
        data: responseData,
    });
});
const getAllLessons = (0, catchAsync_1.default)(async (req, res) => {
    const result = await lesson_service_1.LessonServices.getAllLessonsFromDB(req.query);
    const lessonsWithAudio = result.data.map(lesson => ({
        ...lesson,
        audioUrl: lesson.audioUrl || null,
        audioStatus: lesson.audioStatus || 'pending'
    }));
    res.set('X-Total-Count', String(result.meta.total));
    res.set('X-Page-Count', String(result.meta.totalPages));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Lessons fetched successfully",
        data: lessonsWithAudio,
        meta: result.meta,
    });
});
const updateLesson = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    let updateData = { ...req.body };
    if (req.file) {
        try {
            console.log('Lesson cover image update received:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
            const fileName = `lesson_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const uploadResult = await (0, cloudinary_1.uploadImageToCloudinary)(req.file.buffer, fileName, 'klartext/lessons');
            updateData.coverImage = uploadResult.secure_url;
            console.log('Lesson cover update Cloudinary upload successful:', updateData.coverImage);
        }
        catch (error) {
            console.error('Lesson cover update Cloudinary upload error:', error);
        }
    }
    const result = await lesson_service_1.LessonServices.updateLessonInDB(lessonId, updateData);
    const responseData = {
        ...result.toObject(),
        audioUrl: result.audioUrl || null,
        audioStatus: result.audioStatus || 'pending'
    };
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Lesson updated successfully",
        data: responseData,
    });
});
const deleteLesson = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    const result = await lesson_service_1.LessonServices.deleteLessonFromDB(lessonId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Lesson deleted successfully",
        data: result,
    });
});
const getLessonById = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    const result = await lesson_service_1.LessonServices.getLessonByIdFromDB(lessonId);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Lesson not found');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Lesson fetched successfully",
        data: result,
    });
});
const regenerateAudio = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    const result = await lesson_service_1.LessonServices.regenerateAudioForLesson(lessonId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Audio regeneration started",
        data: result,
    });
});
exports.LessonControllers = {
    createLesson,
    getAllLessons,
    updateLesson,
    deleteLesson,
    getLessonById,
    regenerateAudio,
};
//# sourceMappingURL=lesson.controller.js.map