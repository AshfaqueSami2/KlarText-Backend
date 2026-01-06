"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonProgressServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lessonProgress_model_1 = require("./lessonProgress.model");
const student_model_1 = require("../student/student.model");
const lesson_model_1 = require("../lesson/lesson.model");
const logger_1 = __importDefault(require("../../utils/logger"));
const LEVEL_HIERARCHY = {
    'A1': 1,
    'A2': 2,
    'B1': 3,
    'B2': 4,
    'C1': 5,
    'C2': 6
};
const PREMIUM_LEVELS = ['B1', 'B2', 'C1', 'C2'];
const markLessonAsComplete = async (userId, lessonId) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const student = await student_model_1.Student.findOne({ user: userId });
        if (!student) {
            throw new Error('Student profile not found');
        }
        if (!student.currentLevel) {
            throw new Error('Please select your German level first before completing lessons');
        }
        const lesson = await lesson_model_1.Lesson.findById(lessonId);
        if (!lesson) {
            throw new Error('Lesson not found');
        }
        const isPremium = student.subscriptionStatus === 'premium';
        const isLifetime = student.subscriptionPlan === 'lifetime';
        const isNotExpired = !student.subscriptionExpiry || new Date() < student.subscriptionExpiry;
        const hasActivePremium = isPremium && (isLifetime || isNotExpired);
        if (PREMIUM_LEVELS.includes(lesson.difficulty)) {
            if (!hasActivePremium) {
                throw new Error(`⭐ Premium Required: ${lesson.difficulty} lessons require a premium subscription. Upgrade to Monthly (৳399), Yearly (৳3,999), or Lifetime (৳7,999) to access B1-C2 lessons!`);
            }
        }
        if (!hasActivePremium) {
            const studentRank = LEVEL_HIERARCHY[student.currentLevel] || 0;
            const lessonRank = LEVEL_HIERARCHY[lesson.difficulty] || 0;
            if (studentRank < lessonRank) {
                throw new Error(`Access Denied: This lesson is Level ${lesson.difficulty}. You are currently Level ${student.currentLevel}. Complete all ${student.currentLevel} lessons to unlock this level.`);
            }
        }
        const existingProgress = await lessonProgress_model_1.LessonProgress.findOne({ user: userId, lesson: lessonId });
        if (existingProgress) {
            throw new Error('You have already completed this lesson');
        }
        await lessonProgress_model_1.LessonProgress.create([{ user: userId, lesson: lessonId, isCompleted: true }], { session });
        const updatedStudent = await student_model_1.Student.findOneAndUpdate({ user: userId }, { $inc: { coins: 10 } }, { new: true, session });
        const levelPromotion = await checkAndPromoteLevel(userId, student.currentLevel, lessonId, session);
        await session.commitTransaction();
        await session.endSession();
        return {
            message: "Lesson Completed",
            awardedCoins: 10,
            newBalance: updatedStudent.coins,
            ...levelPromotion
        };
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};
const checkAndPromoteLevel = async (userId, currentLevel, currentLessonId, session) => {
    const lessonsInCurrentLevel = await lesson_model_1.Lesson.find({
        difficulty: currentLevel,
        isPublished: true,
        isDeleted: false
    }).select('_id');
    const totalLessonsInLevel = lessonsInCurrentLevel.length;
    const completedLessons = await lessonProgress_model_1.LessonProgress.find({
        user: userId,
        isCompleted: true,
        lesson: {
            $in: lessonsInCurrentLevel.map(lesson => lesson._id)
        }
    }).session(session);
    const completedLessonsInLevel = completedLessons.length;
    logger_1.default.debug(`Level ${currentLevel}: ${completedLessonsInLevel}/${totalLessonsInLevel} completed`);
    logger_1.default.debug(`Lesson IDs in ${currentLevel}:`, { lessonIds: lessonsInCurrentLevel.map(l => l._id) });
    logger_1.default.debug(`Completed lesson IDs:`, { completedIds: completedLessons.map(p => p.lesson) });
    logger_1.default.debug(`Current lesson being completed:`, { currentLessonId });
    if (completedLessonsInLevel >= totalLessonsInLevel && totalLessonsInLevel > 0) {
        const currentRank = LEVEL_HIERARCHY[currentLevel];
        const nextLevel = Object.keys(LEVEL_HIERARCHY).find(level => LEVEL_HIERARCHY[level] === currentRank + 1);
        if (nextLevel) {
            logger_1.default.info(`Promoting user ${userId} from ${currentLevel} to ${nextLevel}`);
            await student_model_1.Student.findOneAndUpdate({ user: userId }, {
                currentLevel: nextLevel,
                $inc: { coins: 50 }
            }, { new: true, session });
            return {
                levelPromoted: true,
                oldLevel: currentLevel,
                newLevel: nextLevel,
                promotionBonus: 50,
                promotionMessage: `🎉 Congratulations! You've been promoted to ${nextLevel} level! +50 bonus coins!`
            };
        }
        else {
            logger_1.default.debug(`No next level found after ${currentLevel}`);
        }
    }
    return {
        levelPromoted: false,
        progress: `${completedLessonsInLevel}/${totalLessonsInLevel} lessons completed in ${currentLevel} level`
    };
};
const reviewCompletedLesson = async (userId, lessonId) => {
    const progress = await lessonProgress_model_1.LessonProgress.findOne({
        user: userId,
        lesson: lessonId,
        isCompleted: true
    });
    if (!progress) {
        throw new Error('You must complete this lesson first before reviewing it');
    }
    const lesson = await lesson_model_1.Lesson.findById(lessonId);
    if (!lesson) {
        throw new Error('Lesson not found');
    }
    return {
        lesson,
        completedAt: progress.completedAt,
        message: 'Reviewing completed lesson - no additional coins awarded'
    };
};
const getStudentProgress = async (userId) => {
    const student = await student_model_1.Student.findOne({ user: userId });
    if (!student || !student.currentLevel) {
        return {
            totalCompleted: 0,
            totalInCurrentLevel: 0,
            progressPercentage: 0,
            currentLevel: student?.currentLevel || null,
            completedLessons: []
        };
    }
    const lessonsInCurrentLevel = await lesson_model_1.Lesson.find({
        difficulty: student.currentLevel,
        isPublished: true,
        isDeleted: false
    });
    const totalInCurrentLevel = lessonsInCurrentLevel.length;
    const completedInCurrentLevel = await lessonProgress_model_1.LessonProgress.find({
        user: userId,
        isCompleted: true,
        lesson: { $in: lessonsInCurrentLevel.map(l => l._id) }
    })
        .populate('lesson', 'title slug difficulty')
        .sort({ completedAt: -1 });
    const totalCompleted = completedInCurrentLevel.length;
    const progressPercentage = totalInCurrentLevel > 0
        ? Math.round((totalCompleted / totalInCurrentLevel) * 100)
        : 0;
    return {
        totalCompleted,
        totalInCurrentLevel,
        progressPercentage,
        currentLevel: student.currentLevel,
        completedLessons: completedInCurrentLevel.map(progress => ({
            lesson: progress.lesson,
            completedAt: progress.completedAt,
            canReview: true
        }))
    };
};
const getAvailableLessons = async (userId) => {
    const student = await student_model_1.Student.findOne({ user: userId });
    if (!student) {
        throw new Error('Student profile not found');
    }
    if (!student.currentLevel) {
        return {
            message: 'Please select your German level first',
            availableLessons: [],
            needsLevelSelection: true,
            subscriptionStatus: student.subscriptionStatus
        };
    }
    const isPremium = student.subscriptionStatus === 'premium';
    const isLifetime = student.subscriptionPlan === 'lifetime';
    const isNotExpired = !student.subscriptionExpiry || new Date() < student.subscriptionExpiry;
    const hasActiveSubscription = isPremium && (isLifetime || isNotExpired);
    const studentRank = LEVEL_HIERARCHY[student.currentLevel] || 0;
    const availableLevels = Object.keys(LEVEL_HIERARCHY).filter(level => LEVEL_HIERARCHY[level] <= studentRank);
    const lessons = await lesson_model_1.Lesson.find({
        difficulty: { $in: availableLevels },
        isPublished: true,
        isDeleted: false
    }).sort({ difficulty: 1, createdAt: 1 });
    const completedLessons = await lessonProgress_model_1.LessonProgress.find({
        user: userId,
        isCompleted: true
    }).distinct('lesson');
    const formattedLessons = lessons.map(lesson => {
        const isPremiumLesson = PREMIUM_LEVELS.includes(lesson.difficulty);
        const canAccess = !isPremiumLesson || hasActiveSubscription;
        return {
            ...lesson.toObject(),
            isCompleted: completedLessons.some(id => id.equals(lesson._id)),
            isPremium: isPremiumLesson,
            canAccess: canAccess,
            requiresUpgrade: isPremiumLesson && !hasActiveSubscription,
            lockReason: isPremiumLesson && !hasActiveSubscription ? 'Premium subscription required' : null
        };
    });
    return {
        currentLevel: student.currentLevel,
        subscriptionStatus: student.subscriptionStatus,
        subscriptionPlan: student.subscriptionPlan,
        isPremium: hasActiveSubscription,
        availableLessons: formattedLessons,
        totalAvailable: formattedLessons.length,
        completed: completedLessons.length,
        freeLessons: formattedLessons.filter(l => !l.isPremium).length,
        premiumLessons: formattedLessons.filter(l => l.isPremium).length,
        lockedLessons: formattedLessons.filter(l => l.requiresUpgrade).length
    };
};
exports.LessonProgressServices = {
    markLessonAsComplete,
    reviewCompletedLesson,
    getStudentProgress,
    getAvailableLessons,
};
//# sourceMappingURL=lessonProgress.service.js.map