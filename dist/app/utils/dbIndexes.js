"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDatabaseIndexes = exports.createDatabaseIndexes = void 0;
const lesson_model_1 = require("../modules/lesson/lesson.model");
const user_model_1 = require("../modules/user/user.model");
const student_model_1 = require("../modules/student/student.model");
const lessonProgress_model_1 = require("../modules/lessonProgress/lessonProgress.model");
const logger_1 = __importDefault(require("../utils/logger"));
const createDatabaseIndexes = async () => {
    try {
        logger_1.default.info('📊 Creating database indexes...');
        await user_model_1.User.collection.createIndex({ email: 1 }, { unique: true });
        await user_model_1.User.collection.createIndex({ googleId: 1 }, { unique: true, sparse: true });
        await user_model_1.User.collection.createIndex({ role: 1 });
        await user_model_1.User.collection.createIndex({ isDeleted: 1 });
        await user_model_1.User.collection.createIndex({ createdAt: -1 });
        await lesson_model_1.Lesson.collection.createIndex({ slug: 1 }, { unique: true });
        await lesson_model_1.Lesson.collection.createIndex({ difficulty: 1 });
        await lesson_model_1.Lesson.collection.createIndex({ isPublished: 1, isDeleted: 1 });
        await lesson_model_1.Lesson.collection.createIndex({ createdAt: -1 });
        await lesson_model_1.Lesson.collection.createIndex({ difficulty: 1, isPublished: 1, isDeleted: 1 });
        await student_model_1.Student.collection.createIndex({ user: 1 }, { unique: true });
        await student_model_1.Student.collection.createIndex({ currentLevel: 1 });
        await student_model_1.Student.collection.createIndex({ completedLessons: 1 });
        await lessonProgress_model_1.LessonProgress.collection.createIndex({ user: 1, lesson: 1 }, { unique: true });
        await lessonProgress_model_1.LessonProgress.collection.createIndex({ user: 1, completedAt: -1 });
        await lessonProgress_model_1.LessonProgress.collection.createIndex({ lesson: 1 });
        await lessonProgress_model_1.LessonProgress.collection.createIndex({ user: 1, isCompleted: 1 });
        await lesson_model_1.Lesson.collection.createIndex({ difficulty: 1, isPublished: 1, createdAt: -1 }, { name: 'lesson_query_optimization' });
        await lessonProgress_model_1.LessonProgress.collection.createIndex({ user: 1, isCompleted: 1, completedAt: -1 }, { name: 'progress_query_optimization' });
        logger_1.default.info('✅ Database indexes created successfully');
    }
    catch (error) {
        logger_1.default.error('❌ Error creating database indexes:', error);
    }
};
exports.createDatabaseIndexes = createDatabaseIndexes;
const listDatabaseIndexes = async () => {
    try {
        const userIndexes = await user_model_1.User.collection.indexes();
        const lessonIndexes = await lesson_model_1.Lesson.collection.indexes();
        const studentIndexes = await student_model_1.Student.collection.indexes();
        const progressIndexes = await lessonProgress_model_1.LessonProgress.collection.indexes();
        logger_1.default.info('User indexes:', userIndexes);
        logger_1.default.info('Lesson indexes:', lessonIndexes);
        logger_1.default.info('Student indexes:', studentIndexes);
        logger_1.default.info('LessonProgress indexes:', progressIndexes);
    }
    catch (error) {
        logger_1.default.error('Error listing indexes:', error);
    }
};
exports.listDatabaseIndexes = listDatabaseIndexes;
//# sourceMappingURL=dbIndexes.js.map