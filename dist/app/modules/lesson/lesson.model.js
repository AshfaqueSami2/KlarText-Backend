"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lesson = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../user/user.constant");
const lessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    difficulty: {
        type: String,
        enum: user_constant_1.GERMAN_LEVELS,
        required: true
    },
    coverImage: { type: String, default: '' },
    audioUrl: { type: String },
    audioStatus: {
        type: String,
        enum: ['pending', 'generating', 'ready', 'error'],
        default: 'pending'
    },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
lessonSchema.index({ difficulty: 1 });
lessonSchema.index({ isPublished: 1, isDeleted: 1 });
lessonSchema.index({ createdAt: -1 });
lessonSchema.index({ title: 'text', content: 'text' });
exports.Lesson = (0, mongoose_1.model)('Lesson', lessonSchema);
//# sourceMappingURL=lesson.model.js.map