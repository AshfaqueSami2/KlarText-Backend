"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsServices = void 0;
const student_model_1 = require("../student/student.model");
const vocab_model_1 = require("../vocabulary/vocab.model");
const lessonProgress_model_1 = require("../lessonProgress/lessonProgress.model");
const user_model_1 = require("../user/user.model");
const lesson_model_1 = require("../lesson/lesson.model");
const getStudentAnalytics = async (userId) => {
    const totalWords = await vocab_model_1.Vocab.countDocuments({ user: userId });
    const completedLessons = await lessonProgress_model_1.LessonProgress.countDocuments({
        user: userId,
        isCompleted: true,
    });
    const studentProfile = await student_model_1.Student.findOne({ user: userId });
    return {
        totalWords,
        completedLessons,
        coins: studentProfile?.coins || 0,
        currentLevel: studentProfile?.currentLevel || null,
    };
};
const getLeaderboard = async () => {
    const result = await student_model_1.Student.find()
        .sort({ coins: -1 })
        .limit(10)
        .populate("user", "name profileImage")
        .select("coins currentLevel user");
    return result;
};
const getAdminStats = async () => {
    const totalStudents = await user_model_1.User.countDocuments({ role: "student" });
    const totalLessons = await lesson_model_1.Lesson.countDocuments();
    const publishedLessons = await lesson_model_1.Lesson.countDocuments({ isPublished: true });
    return {
        totalStudents,
        totalLessons,
        publishedLessons,
    };
};
const getAllLessonsForAdmin = async (query) => {
    const queryObj = { ...query };
    const excludeFields = ["sort", "page", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    const result = await lesson_model_1.Lesson.find(queryObj).sort({ createdAt: -1 });
    return result;
};
exports.AnalyticsServices = {
    getStudentAnalytics,
    getLeaderboard,
    getAdminStats,
    getAllLessonsForAdmin,
};
//# sourceMappingURL=analytics.service.js.map