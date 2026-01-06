"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarControllers = void 0;
const grammar_service_1 = require("./grammar.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_ts_1 = require("http-status-ts");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const logger_1 = __importDefault(require("../../utils/logger"));
const createTopic = (0, catchAsync_1.default)(async (req, res) => {
    const result = await grammar_service_1.GrammarServices.createTopic(req.body);
    logger_1.default.info(`📚 Grammar topic created: ${result.title}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.CREATED,
        success: true,
        message: 'Grammar topic created successfully',
        data: result,
    });
});
const getAllTopics = (0, catchAsync_1.default)(async (req, res) => {
    const isAdmin = req.user?.role === 'admin';
    const query = { ...req.query };
    if (isAdmin && req.query.showAll === 'true') {
        query.showAll = 'true';
    }
    const result = await grammar_service_1.GrammarServices.getAllTopics(query);
    res.set('X-Total-Count', String(result.meta.total));
    res.set('X-Page-Count', String(result.meta.totalPages));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar topics fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
const getTopicById = (0, catchAsync_1.default)(async (req, res) => {
    const { topicId } = req.params;
    const result = await grammar_service_1.GrammarServices.getTopicByIdOrSlug(topicId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar topic fetched successfully',
        data: result,
    });
});
const updateTopic = (0, catchAsync_1.default)(async (req, res) => {
    const { topicId } = req.params;
    const result = await grammar_service_1.GrammarServices.updateTopic(topicId, req.body);
    logger_1.default.info(`📚 Grammar topic updated: ${result.title}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar topic updated successfully',
        data: result,
    });
});
const deleteTopic = (0, catchAsync_1.default)(async (req, res) => {
    const { topicId } = req.params;
    await grammar_service_1.GrammarServices.deleteTopic(topicId);
    logger_1.default.info(`📚 Grammar topic deleted: ${topicId}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar topic deleted successfully',
        data: null,
    });
});
const createLesson = (0, catchAsync_1.default)(async (req, res) => {
    const result = await grammar_service_1.GrammarServices.createLesson(req.body);
    logger_1.default.info(`📖 Grammar lesson created: ${result.title}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.CREATED,
        success: true,
        message: 'Grammar lesson created successfully',
        data: result,
    });
});
const getLessonsByTopic = (0, catchAsync_1.default)(async (req, res) => {
    const { topicId } = req.params;
    const isAdmin = req.user?.role === 'admin';
    const query = { ...req.query };
    if (isAdmin && req.query.showAll === 'true') {
        query.showAll = 'true';
    }
    const result = await grammar_service_1.GrammarServices.getLessonsByTopic(topicId, query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar lessons fetched successfully',
        data: result.data,
        meta: result.meta,
    });
});
const getLessonById = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    const userId = req.user?.userId;
    const result = await grammar_service_1.GrammarServices.getLessonByIdOrSlug(lessonId, userId);
    if (userId) {
        await grammar_service_1.GrammarServices.updateLessonProgress(userId, lessonId);
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar lesson fetched successfully',
        data: result,
    });
});
const updateLesson = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    const result = await grammar_service_1.GrammarServices.updateLesson(lessonId, req.body);
    logger_1.default.info(`📖 Grammar lesson updated: ${result.title}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar lesson updated successfully',
        data: result,
    });
});
const deleteLesson = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    await grammar_service_1.GrammarServices.deleteLesson(lessonId);
    logger_1.default.info(`📖 Grammar lesson deleted: ${lessonId}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar lesson deleted successfully',
        data: null,
    });
});
const completeLessonProgress = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    const userId = req.user?.userId;
    const { timeSpent } = req.body;
    if (!userId) {
        throw new AppError_1.default(401, 'Authentication required');
    }
    const result = await grammar_service_1.GrammarServices.updateLessonProgress(userId, lessonId, timeSpent, true);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Lesson marked as completed',
        data: result,
    });
});
const createExerciseSet = (0, catchAsync_1.default)(async (req, res) => {
    const result = await grammar_service_1.GrammarServices.createExerciseSet(req.body);
    logger_1.default.info(`📝 Grammar exercise set created: ${result.title}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.CREATED,
        success: true,
        message: 'Grammar exercise set created successfully',
        data: result,
    });
});
const getExerciseSetsByLesson = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    const isAdmin = req.user?.role === 'admin';
    const query = { ...req.query };
    if (isAdmin && req.query.showAll === 'true') {
        query.showAll = 'true';
    }
    const result = await grammar_service_1.GrammarServices.getExerciseSetsByLesson(lessonId, query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Exercise sets fetched successfully',
        data: result,
    });
});
const getExerciseSetById = (0, catchAsync_1.default)(async (req, res) => {
    const { exerciseSetId } = req.params;
    const userId = req.user?.userId;
    const result = await grammar_service_1.GrammarServices.getExerciseSetById(exerciseSetId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Exercise set fetched successfully',
        data: result,
    });
});
const updateExerciseSet = (0, catchAsync_1.default)(async (req, res) => {
    const { exerciseSetId } = req.params;
    const result = await grammar_service_1.GrammarServices.updateExerciseSet(exerciseSetId, req.body);
    logger_1.default.info(`📝 Grammar exercise set updated: ${result.title}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Exercise set updated successfully',
        data: result,
    });
});
const deleteExerciseSet = (0, catchAsync_1.default)(async (req, res) => {
    const { exerciseSetId } = req.params;
    await grammar_service_1.GrammarServices.deleteExerciseSet(exerciseSetId);
    logger_1.default.info(`📝 Grammar exercise set deleted: ${exerciseSetId}`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Exercise set deleted successfully',
        data: null,
    });
});
const submitExerciseAnswers = (0, catchAsync_1.default)(async (req, res) => {
    const { exerciseSetId } = req.params;
    const userId = req.user?.userId;
    const { answers, timeSpent } = req.body;
    if (!userId) {
        throw new AppError_1.default(401, 'Authentication required');
    }
    const result = await grammar_service_1.GrammarServices.submitExerciseAnswers(userId, exerciseSetId, answers, timeSpent);
    logger_1.default.info(`📝 Exercise submitted: User ${userId}, Score: ${result.score}%`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: result.isPassed
            ? `Congratulations! You passed with ${result.score}%!`
            : `You scored ${result.score}%. Keep practicing!`,
        data: result,
    });
});
const getUserProgress = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        throw new AppError_1.default(401, 'Authentication required');
    }
    const result = await grammar_service_1.GrammarServices.getUserGrammarProgress(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Grammar progress fetched successfully',
        data: result,
    });
});
const getRecommendedLesson = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.userId;
    const { difficulty } = req.query;
    if (!userId) {
        throw new AppError_1.default(401, 'Authentication required');
    }
    const result = await grammar_service_1.GrammarServices.getRecommendedLesson(userId, difficulty);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: result
            ? 'Recommended lesson found'
            : 'All lessons completed! Great job!',
        data: result,
    });
});
exports.GrammarControllers = {
    createTopic,
    getAllTopics,
    getTopicById,
    updateTopic,
    deleteTopic,
    createLesson,
    getLessonsByTopic,
    getLessonById,
    updateLesson,
    deleteLesson,
    completeLessonProgress,
    createExerciseSet,
    getExerciseSetsByLesson,
    getExerciseSetById,
    updateExerciseSet,
    deleteExerciseSet,
    submitExerciseAnswers,
    getUserProgress,
    getRecommendedLesson,
};
//# sourceMappingURL=grammar.controller.js.map