"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../Error/AppError"));
const lesson_model_1 = require("../lesson/lesson.model");
const vocab_model_1 = require("./vocab.model");
const addVocabToDB = async (payload) => {
    if (payload.lessonId) {
        const lesson = await lesson_model_1.Lesson.findById(payload.lessonId);
        if (!lesson) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "The associated lesson does not exist.");
        }
        const contentLower = lesson.content.toLowerCase();
        const wordLower = payload.word.toLowerCase();
        if (!contentLower.includes(wordLower)) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "This word does not appear in the specified lesson.");
        }
    }
    const result = await vocab_model_1.Vocab.updateOne({ user: payload.user, word: payload.word }, {
        $set: payload,
        $setOnInsert: { whenToReview: new Date() }
    }, { upsert: true });
    return result;
};
const getMyVocabFromDB = async (userId) => {
    const result = await vocab_model_1.Vocab.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate('lessonId', 'title');
    return result;
};
exports.VocabServices = {
    addVocabToDB,
    getMyVocabFromDB,
};
//# sourceMappingURL=vocab.service.js.map