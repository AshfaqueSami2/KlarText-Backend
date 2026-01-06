"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonProgress = void 0;
const mongoose_1 = require("mongoose");
const lessonProgressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    isCompleted: { type: Boolean, default: true },
    completedAt: { type: Date, default: Date.now },
}, { timestamps: true });
lessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });
exports.LessonProgress = (0, mongoose_1.model)('LessonProgress', lessonProgressSchema);
//# sourceMappingURL=lessonProgress.model.js.map