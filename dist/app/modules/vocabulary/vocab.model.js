"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vocab = void 0;
const mongoose_1 = require("mongoose");
const vocabSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Lesson' },
    word: { type: String, required: true, trim: true },
    meaning: { type: String, required: true },
    pronunciation: { type: String },
    whenToReview: { type: Date, default: Date.now },
}, { timestamps: true });
vocabSchema.index({ user: 1, word: 1 }, { unique: true });
exports.Vocab = (0, mongoose_1.model)('Vocab', vocabSchema);
//# sourceMappingURL=vocab.model.js.map