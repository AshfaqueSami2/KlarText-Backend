"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonServices = void 0;
const lesson_model_1 = require("./lesson.model");
const tts_service_1 = require("../textToS/tts.service");
const logger_1 = __importDefault(require("../../utils/logger"));
const generateLessonAudioAsync = async (lessonId, title, content) => {
    const startTime = Date.now();
    logger_1.default.info(`🎤 Starting audio generation for lesson: ${lessonId}`);
    try {
        await lesson_model_1.Lesson.findByIdAndUpdate(lessonId, {
            audioStatus: 'generating',
            updatedAt: new Date()
        });
        const lesson = await lesson_model_1.Lesson.findById(lessonId);
        if (!lesson || !lesson.isPublished) {
            logger_1.default.warn(`⚠️ Lesson ${lessonId} no longer exists or not published, skipping audio generation`);
            return;
        }
        const audioResult = await tts_service_1.AzureTTSService.generateLessonAudio(title, content, {
            voiceName: 'de-DE-KatjaNeural',
            language: 'de-DE',
            speed: 0.95,
            pitch: 0
        });
        const updateResult = await lesson_model_1.Lesson.findByIdAndUpdate(lessonId, {
            audioUrl: audioResult.audioUrl,
            audioStatus: 'ready',
            updatedAt: new Date()
        }, { new: true });
        const duration = Date.now() - startTime;
        logger_1.default.info(`✅ Audio generated successfully for lesson: ${lessonId} (${duration}ms)`);
        logger_1.default.debug(`🔗 Audio URL: ${audioResult.audioUrl}`);
        return updateResult;
    }
    catch (error) {
        const duration = Date.now() - startTime;
        logger_1.default.error(`❌ Failed to generate audio for lesson ${lessonId} after ${duration}ms`, { error });
        await lesson_model_1.Lesson.findByIdAndUpdate(lessonId, {
            audioStatus: 'error',
            updatedAt: new Date()
        });
        logger_1.default.error('Audio generation error details', {
            lessonId,
            title: title.substring(0, 50),
            contentLength: content.length,
            error: error instanceof Error ? error.message : String(error)
        });
    }
};
const createLessonIntoDB = async (payload) => {
    const result = await lesson_model_1.Lesson.create(payload);
    if (result.isPublished) {
        logger_1.default.info(`📝 Lesson created with ID: ${result._id}, enqueueing audio generation...`);
        await lesson_model_1.Lesson.findByIdAndUpdate(result._id, { audioStatus: 'pending' });
        setImmediate(() => {
            generateLessonAudioAsync(result._id.toString(), result.title, result.content);
        });
        logger_1.default.info(`🔄 Audio generation job enqueued for lesson: ${result._id}`);
    }
    return result;
};
const getAllLessonsFromDB = async (query) => {
    const queryObj = { ...query };
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    const sortBy = query.sort || '-createdAt';
    const [result, total] = await Promise.all([
        lesson_model_1.Lesson.find({
            ...queryObj,
            isPublished: true,
            isDeleted: false
        })
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .lean(),
        lesson_model_1.Lesson.countDocuments({
            ...queryObj,
            isPublished: true,
            isDeleted: false
        })
    ]);
    return {
        data: result,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const updateLessonInDB = async (id, payload) => {
    const existingLesson = await lesson_model_1.Lesson.findById(id);
    if (!existingLesson) {
        throw new Error('Lesson not found');
    }
    const result = await lesson_model_1.Lesson.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    const isNowPublished = payload.isPublished && !existingLesson.isPublished;
    const contentChanged = (payload.title && payload.title !== existingLesson.title) ||
        (payload.content && payload.content !== existingLesson.content);
    const needsAudio = !result.audioUrl && result.isPublished;
    if (result && (isNowPublished || (contentChanged && result.isPublished) || needsAudio)) {
        logger_1.default.info(`🔄 Audio regeneration triggered for lesson: ${id}`, {
            isNowPublished,
            contentChanged,
            needsAudio
        });
        await lesson_model_1.Lesson.findByIdAndUpdate(id, {
            audioUrl: null,
            audioStatus: 'pending',
            updatedAt: new Date()
        });
        setImmediate(() => {
            generateLessonAudioAsync(result._id.toString(), result.title, result.content);
        });
        logger_1.default.info(`🎤 Audio regeneration job enqueued for lesson: ${id}`);
    }
    return result;
};
const deleteLessonFromDB = async (id) => {
    const result = await lesson_model_1.Lesson.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    return result;
};
const getLessonByIdFromDB = async (id) => {
    const result = await lesson_model_1.Lesson.findOne({
        _id: id,
        isDeleted: false
    }).lean();
    return result;
};
const regenerateAudioForLesson = async (id) => {
    const lesson = await lesson_model_1.Lesson.findById(id);
    if (!lesson || !lesson.isPublished) {
        throw new Error('Lesson not found or not published');
    }
    await lesson_model_1.Lesson.findByIdAndUpdate(id, { audioStatus: 'pending' });
    setImmediate(() => {
        generateLessonAudioAsync(lesson._id.toString(), lesson.title, lesson.content);
    });
    return { message: 'Audio regeneration started' };
};
exports.LessonServices = {
    createLessonIntoDB,
    getAllLessonsFromDB,
    updateLessonInDB,
    deleteLessonFromDB,
    getLessonByIdFromDB,
    regenerateAudioForLesson
};
//# sourceMappingURL=lesson.service.js.map