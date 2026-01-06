"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarServices = void 0;
const mongoose_1 = require("mongoose");
const grammar_model_1 = require("./grammar.model");
const tts_service_1 = require("../textToS/tts.service");
const logger_1 = __importDefault(require("../../utils/logger"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const createTopic = async (payload) => {
    const result = await grammar_model_1.GrammarTopic.create(payload);
    return result;
};
const getAllTopics = async (query) => {
    const queryObj = { ...query };
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const excludeFields = ['sort', 'page', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    const filter = {
        ...queryObj,
        isDeleted: false,
    };
    if (query.showAll !== 'true') {
        filter.isPublished = true;
    }
    delete filter.showAll;
    const sortBy = query.sort || 'order';
    const [topics, total] = await Promise.all([
        grammar_model_1.GrammarTopic.find(filter)
            .populate('lessonCount')
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .lean(),
        grammar_model_1.GrammarTopic.countDocuments(filter)
    ]);
    return {
        data: topics,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const getTopicByIdOrSlug = async (identifier) => {
    const isObjectId = mongoose_1.Types.ObjectId.isValid(identifier);
    const topic = await grammar_model_1.GrammarTopic.findOne(isObjectId
        ? { _id: identifier, isDeleted: false }
        : { slug: identifier, isDeleted: false }).populate('lessonCount').lean();
    if (!topic) {
        throw new AppError_1.default(404, 'Grammar topic not found');
    }
    return topic;
};
const updateTopic = async (id, payload) => {
    const result = await grammar_model_1.GrammarTopic.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(404, 'Grammar topic not found');
    }
    return result;
};
const deleteTopic = async (id) => {
    const result = await grammar_model_1.GrammarTopic.findByIdAndUpdate(id, { isDeleted: true, isPublished: false }, { new: true });
    if (!result) {
        throw new AppError_1.default(404, 'Grammar topic not found');
    }
    await grammar_model_1.GrammarLesson.updateMany({ topic: id }, { isDeleted: true, isPublished: false });
    return result;
};
const generateLessonAudioAsync = async (lessonId, content) => {
    try {
        await grammar_model_1.GrammarLesson.findByIdAndUpdate(lessonId, { audioStatus: 'generating' });
        const audioResult = await tts_service_1.AzureTTSService.generateLessonAudio('', content, {
            voiceName: 'de-DE-KatjaNeural',
            language: 'de-DE',
            speed: 0.9,
            pitch: 0
        });
        await grammar_model_1.GrammarLesson.findByIdAndUpdate(lessonId, {
            audioUrl: audioResult.audioUrl,
            audioStatus: 'ready'
        });
        logger_1.default.info(`✅ Grammar lesson audio generated: ${lessonId}`);
    }
    catch (error) {
        logger_1.default.error(`❌ Failed to generate grammar lesson audio: ${lessonId}`, { error });
        await grammar_model_1.GrammarLesson.findByIdAndUpdate(lessonId, { audioStatus: 'error' });
    }
};
const createLesson = async (payload) => {
    const topic = await grammar_model_1.GrammarTopic.findById(payload.topic);
    if (!topic || topic.isDeleted) {
        throw new AppError_1.default(404, 'Grammar topic not found');
    }
    const result = await grammar_model_1.GrammarLesson.create(payload);
    if (result.isPublished && result.practiceExamples.length > 0) {
        const audioContent = result.practiceExamples
            .map(ex => ex.german)
            .join('. ');
        setImmediate(() => {
            generateLessonAudioAsync(result._id.toString(), audioContent);
        });
    }
    return result;
};
const getLessonsByTopic = async (topicId, query) => {
    const page = Number(query.page) || 1;
    const limit = Math.min(Number(query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const filter = {
        topic: topicId,
        isDeleted: false,
    };
    if (query.showAll !== 'true') {
        filter.isPublished = true;
    }
    const [lessons, total] = await Promise.all([
        grammar_model_1.GrammarLesson.find(filter)
            .sort('order')
            .skip(skip)
            .limit(limit)
            .lean(),
        grammar_model_1.GrammarLesson.countDocuments(filter)
    ]);
    return {
        data: lessons,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
};
const getLessonByIdOrSlug = async (identifier, userId) => {
    const isObjectId = mongoose_1.Types.ObjectId.isValid(identifier);
    const lesson = await grammar_model_1.GrammarLesson.findOne(isObjectId
        ? { _id: identifier, isDeleted: false }
        : { slug: identifier, isDeleted: false }).populate('topic', 'title titleDe slug').lean();
    if (!lesson) {
        throw new AppError_1.default(404, 'Grammar lesson not found');
    }
    let progress = null;
    if (userId) {
        progress = await grammar_model_1.GrammarLessonProgress.findOne({
            user: userId,
            lesson: lesson._id
        }).lean();
    }
    const exerciseSets = await grammar_model_1.GrammarExerciseSet.find({
        lesson: lesson._id,
        isDeleted: false,
        isPublished: true
    }).select('title titleDe slug difficulty exerciseCount passingScore order').lean();
    return {
        ...lesson,
        progress,
        exerciseSets: exerciseSets.map(set => ({
            ...set,
            exerciseCount: set.exercises?.length || 0
        }))
    };
};
const updateLesson = async (id, payload) => {
    const result = await grammar_model_1.GrammarLesson.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(404, 'Grammar lesson not found');
    }
    return result;
};
const deleteLesson = async (id) => {
    const result = await grammar_model_1.GrammarLesson.findByIdAndUpdate(id, { isDeleted: true, isPublished: false }, { new: true });
    if (!result) {
        throw new AppError_1.default(404, 'Grammar lesson not found');
    }
    await grammar_model_1.GrammarExerciseSet.updateMany({ lesson: id }, { isDeleted: true, isPublished: false });
    return result;
};
const createExerciseSet = async (payload) => {
    const lesson = await grammar_model_1.GrammarLesson.findById(payload.lesson);
    if (!lesson || lesson.isDeleted) {
        throw new AppError_1.default(404, 'Grammar lesson not found');
    }
    const result = await grammar_model_1.GrammarExerciseSet.create(payload);
    return result;
};
const getExerciseSetsByLesson = async (lessonId, query) => {
    const filter = {
        lesson: lessonId,
        isDeleted: false,
    };
    if (query.showAll !== 'true') {
        filter.isPublished = true;
    }
    const exerciseSets = await grammar_model_1.GrammarExerciseSet.find(filter)
        .sort('order')
        .lean();
    return exerciseSets.map(set => ({
        ...set,
        exerciseCount: set.exercises?.length || 0
    }));
};
const getExerciseSetById = async (id, userId) => {
    const exerciseSet = await grammar_model_1.GrammarExerciseSet.findOne({
        _id: id,
        isDeleted: false
    }).populate('lesson', 'title titleDe slug topic').lean();
    if (!exerciseSet) {
        throw new AppError_1.default(404, 'Exercise set not found');
    }
    let progress = null;
    if (userId) {
        progress = await grammar_model_1.GrammarExerciseProgress.findOne({
            user: userId,
            exerciseSet: id
        }).lean();
    }
    return {
        ...exerciseSet,
        progress
    };
};
const updateExerciseSet = async (id, payload) => {
    const result = await grammar_model_1.GrammarExerciseSet.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!result) {
        throw new AppError_1.default(404, 'Exercise set not found');
    }
    return result;
};
const deleteExerciseSet = async (id) => {
    const result = await grammar_model_1.GrammarExerciseSet.findByIdAndUpdate(id, { isDeleted: true, isPublished: false }, { new: true });
    if (!result) {
        throw new AppError_1.default(404, 'Exercise set not found');
    }
    return result;
};
const validateAnswer = (exercise, userAnswer) => {
    const normalizeString = (s) => s.toLowerCase().trim();
    let isCorrect = false;
    switch (exercise.type) {
        case 'fill-blank': {
            const acceptable = [exercise.correctAnswer, ...(exercise.acceptableAnswers || [])];
            isCorrect = acceptable.some(a => normalizeString(a) === normalizeString(userAnswer));
            break;
        }
        case 'multiple-choice': {
            const correctOption = exercise.options.find(o => o.isCorrect);
            isCorrect = correctOption ? normalizeString(correctOption.text) === normalizeString(userAnswer) : false;
            break;
        }
        case 'matching': {
            if (Array.isArray(userAnswer) && userAnswer.length === exercise.pairs.length) {
                isCorrect = exercise.pairs.every((pair, idx) => {
                    const userPair = userAnswer[idx];
                    return userPair && normalizeString(userPair) === normalizeString(pair.right);
                });
            }
            break;
        }
        case 'word-order': {
            if (Array.isArray(userAnswer)) {
                isCorrect = exercise.correctOrder.every((word, idx) => normalizeString(word) === normalizeString(userAnswer[idx]));
            }
            break;
        }
        case 'conjugation':
            isCorrect = normalizeString(exercise.correctAnswer) === normalizeString(userAnswer);
            break;
        case 'case-selection':
            isCorrect = normalizeString(exercise.correctCase) === normalizeString(userAnswer);
            break;
        case 'article-selection':
            isCorrect = normalizeString(exercise.correctAnswer) === normalizeString(userAnswer);
            break;
        case 'translation': {
            const answer = normalizeString(userAnswer);
            isCorrect = exercise.correctTranslations.some(t => normalizeString(t) === answer);
            if (!isCorrect && exercise.keyWords) {
                const hasKeyWords = exercise.keyWords.every(kw => answer.includes(normalizeString(kw)));
                if (hasKeyWords) {
                    return { isCorrect: false, points: Math.floor(exercise.points * 0.5) };
                }
            }
            break;
        }
        case 'error-correction':
            isCorrect = normalizeString(exercise.correctSentence) === normalizeString(userAnswer);
            break;
    }
    return {
        isCorrect,
        points: isCorrect ? exercise.points : 0
    };
};
const submitExerciseAnswers = async (userId, exerciseSetId, answers, timeSpent) => {
    const exerciseSet = await grammar_model_1.GrammarExerciseSet.findById(exerciseSetId);
    if (!exerciseSet || exerciseSet.isDeleted) {
        throw new AppError_1.default(404, 'Exercise set not found');
    }
    const gradedAnswers = answers.map(answer => {
        const exercise = exerciseSet.exercises[answer.exerciseIndex];
        if (!exercise) {
            return {
                exerciseIndex: answer.exerciseIndex,
                userAnswer: answer.userAnswer,
                isCorrect: false,
                pointsEarned: 0
            };
        }
        const result = validateAnswer(exercise, answer.userAnswer);
        return {
            exerciseIndex: answer.exerciseIndex,
            userAnswer: answer.userAnswer,
            isCorrect: result.isCorrect,
            pointsEarned: result.points
        };
    });
    const correctAnswers = gradedAnswers.filter(a => a.isCorrect).length;
    const totalQuestions = exerciseSet.exercises.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = score >= exerciseSet.passingScore;
    let progress = await grammar_model_1.GrammarExerciseProgress.findOne({
        user: userId,
        exerciseSet: exerciseSetId
    });
    if (!progress) {
        progress = new grammar_model_1.GrammarExerciseProgress({
            user: userId,
            exerciseSet: exerciseSetId,
            lesson: exerciseSet.lesson,
            attempts: [],
            bestScore: 0,
            isPassed: false,
            masteryLevel: 'learning'
        });
    }
    const attemptNumber = progress.attempts.length + 1;
    progress.attempts.push({
        attemptNumber,
        score,
        correctAnswers,
        totalQuestions,
        timeSpent,
        answers: gradedAnswers,
        completedAt: new Date()
    });
    if (score > progress.bestScore) {
        progress.bestScore = score;
    }
    if (isPassed && !progress.isPassed) {
        progress.isPassed = true;
    }
    if (score >= 90 && attemptNumber >= 2) {
        progress.masteryLevel = 'mastered';
    }
    else if (score >= 70) {
        progress.masteryLevel = 'practicing';
    }
    await progress.save();
    await updateTopicMastery(userId, exerciseSet.lesson.toString());
    return {
        score,
        correctAnswers,
        totalQuestions,
        isPassed,
        masteryLevel: progress.masteryLevel,
        gradedAnswers: gradedAnswers.map((answer, idx) => ({
            ...answer,
            exercise: exerciseSet.exercises[answer.exerciseIndex]
        })),
        attemptNumber,
        bestScore: progress.bestScore
    };
};
const updateLessonProgress = async (userId, lessonId, timeSpent, isCompleted) => {
    let progress = await grammar_model_1.GrammarLessonProgress.findOne({
        user: userId,
        lesson: lessonId
    });
    if (!progress) {
        progress = new grammar_model_1.GrammarLessonProgress({
            user: userId,
            lesson: lessonId,
            isCompleted: false,
            timeSpent: 0,
            revisitCount: 0,
            lastVisitedAt: new Date()
        });
    }
    else {
        progress.revisitCount += 1;
    }
    if (timeSpent !== undefined) {
        progress.timeSpent += timeSpent;
    }
    if (isCompleted !== undefined) {
        progress.isCompleted = isCompleted;
        if (isCompleted) {
            progress.completedAt = new Date();
        }
    }
    progress.lastVisitedAt = new Date();
    await progress.save();
    const lesson = await grammar_model_1.GrammarLesson.findById(lessonId).select('topic').lean();
    if (lesson) {
        await updateTopicMastery(userId, lessonId);
    }
    return progress;
};
const updateTopicMastery = async (userId, lessonId) => {
    const lesson = await grammar_model_1.GrammarLesson.findById(lessonId).select('topic').lean();
    if (!lesson)
        return;
    const topicId = lesson.topic.toString();
    const lessons = await grammar_model_1.GrammarLesson.find({
        topic: topicId,
        isDeleted: false,
        isPublished: true
    }).select('_id').lean();
    const lessonIds = lessons.map(l => l._id);
    const lessonProgress = await grammar_model_1.GrammarLessonProgress.find({
        user: userId,
        lesson: { $in: lessonIds }
    }).lean();
    const lessonsCompleted = lessonProgress.filter(p => p.isCompleted).length;
    const exerciseSets = await grammar_model_1.GrammarExerciseSet.find({
        lesson: { $in: lessonIds },
        isDeleted: false,
        isPublished: true
    }).select('_id').lean();
    const exerciseSetIds = exerciseSets.map(e => e._id);
    const exerciseProgress = await grammar_model_1.GrammarExerciseProgress.find({
        user: userId,
        exerciseSet: { $in: exerciseSetIds }
    }).lean();
    const exercisesPassed = exerciseProgress.filter(p => p.isPassed).length;
    const averageScore = exerciseProgress.length > 0
        ? exerciseProgress.reduce((sum, p) => sum + p.bestScore, 0) / exerciseProgress.length
        : 0;
    let masteryLevel = 'not-started';
    const completionRate = lessons.length > 0 ? lessonsCompleted / lessons.length : 0;
    const exerciseRate = exerciseSets.length > 0 ? exercisesPassed / exerciseSets.length : 0;
    if (completionRate === 0) {
        masteryLevel = 'not-started';
    }
    else if (completionRate < 0.3) {
        masteryLevel = 'beginner';
    }
    else if (completionRate < 0.6 || averageScore < 70) {
        masteryLevel = 'intermediate';
    }
    else if (completionRate < 0.9 || averageScore < 85) {
        masteryLevel = 'advanced';
    }
    else if (exerciseRate >= 0.9 && averageScore >= 90) {
        masteryLevel = 'mastered';
    }
    else {
        masteryLevel = 'advanced';
    }
    await grammar_model_1.GrammarTopicMastery.findOneAndUpdate({ user: userId, topic: topicId }, {
        lessonsCompleted,
        totalLessons: lessons.length,
        exercisesPassed,
        totalExercises: exerciseSets.length,
        averageScore: Math.round(averageScore),
        masteryLevel,
        lastActivityAt: new Date()
    }, { upsert: true, new: true });
};
const getUserGrammarProgress = async (userId) => {
    const [topicMasteries, lessonProgress, exerciseProgress] = await Promise.all([
        grammar_model_1.GrammarTopicMastery.find({ user: userId })
            .populate('topic', 'title titleDe slug difficulty icon')
            .lean(),
        grammar_model_1.GrammarLessonProgress.find({ user: userId }).lean(),
        grammar_model_1.GrammarExerciseProgress.find({ user: userId }).lean()
    ]);
    const totalLessonsCompleted = lessonProgress.filter(p => p.isCompleted).length;
    const totalExercisesPassed = exerciseProgress.filter(p => p.isPassed).length;
    const totalTimeSpent = lessonProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    const averageExerciseScore = exerciseProgress.length > 0
        ? exerciseProgress.reduce((sum, p) => sum + p.bestScore, 0) / exerciseProgress.length
        : 0;
    return {
        overview: {
            totalLessonsCompleted,
            totalExercisesPassed,
            totalTimeSpent,
            averageExerciseScore: Math.round(averageExerciseScore)
        },
        topicMasteries,
        recentActivity: lessonProgress
            .sort((a, b) => new Date(b.lastVisitedAt).getTime() - new Date(a.lastVisitedAt).getTime())
            .slice(0, 5)
    };
};
const getRecommendedLesson = async (userId, difficulty) => {
    const completedLessons = await grammar_model_1.GrammarLessonProgress.find({
        user: userId,
        isCompleted: true
    }).select('lesson').lean();
    const completedIds = completedLessons.map(p => p.lesson);
    const filter = {
        _id: { $nin: completedIds },
        isDeleted: false,
        isPublished: true
    };
    if (difficulty) {
        filter.difficulty = difficulty;
    }
    const nextLesson = await grammar_model_1.GrammarLesson.findOne(filter)
        .sort({ difficulty: 1, order: 1 })
        .populate('topic', 'title titleDe slug')
        .lean();
    return nextLesson;
};
exports.GrammarServices = {
    createTopic,
    getAllTopics,
    getTopicByIdOrSlug,
    updateTopic,
    deleteTopic,
    createLesson,
    getLessonsByTopic,
    getLessonByIdOrSlug,
    updateLesson,
    deleteLesson,
    createExerciseSet,
    getExerciseSetsByLesson,
    getExerciseSetById,
    updateExerciseSet,
    deleteExerciseSet,
    submitExerciseAnswers,
    updateLessonProgress,
    getUserGrammarProgress,
    getRecommendedLesson,
};
//# sourceMappingURL=grammar.service.js.map