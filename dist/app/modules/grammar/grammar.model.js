"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarTopicMastery = exports.GrammarExerciseProgress = exports.GrammarLessonProgress = exports.GrammarExerciseSet = exports.GrammarLesson = exports.GrammarTopic = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../user/user.constant");
const grammarTopicSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    titleDe: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    descriptionDe: { type: String, required: true },
    icon: { type: String, default: 'book' },
    difficulty: {
        type: String,
        enum: user_constant_1.GERMAN_LEVELS,
        required: true
    },
    order: { type: Number, default: 0 },
    coverImage: { type: String, default: '' },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
grammarTopicSchema.virtual('lessonCount', {
    ref: 'GrammarLesson',
    localField: '_id',
    foreignField: 'topic',
    count: true
});
grammarTopicSchema.index({ difficulty: 1, order: 1 });
grammarTopicSchema.index({ isPublished: 1, isDeleted: 1 });
grammarTopicSchema.index({ title: 'text', titleDe: 'text', description: 'text' });
exports.GrammarTopic = (0, mongoose_1.model)('GrammarTopic', grammarTopicSchema);
const explanationBlockSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['text', 'table', 'example', 'tip', 'warning', 'comparison'],
        required: true
    },
    title: { type: String },
    titleDe: { type: String },
    content: { type: String, required: true },
    contentDe: { type: String, required: true },
    tableData: {
        headers: [{ type: String }],
        rows: [[{ type: String }]]
    },
    examples: [{
            german: { type: String },
            english: { type: String },
            breakdown: { type: String },
            audioUrl: { type: String }
        }]
}, { _id: false });
const grammarLessonSchema = new mongoose_1.Schema({
    topic: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GrammarTopic', required: true },
    title: { type: String, required: true, trim: true },
    titleDe: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    difficulty: {
        type: String,
        enum: user_constant_1.GERMAN_LEVELS,
        required: true
    },
    order: { type: Number, default: 0 },
    introduction: { type: String, required: true },
    introductionDe: { type: String, required: true },
    explanationBlocks: [explanationBlockSchema],
    keyPoints: [{
            point: { type: String, required: true },
            pointDe: { type: String, required: true }
        }],
    commonMistakes: [{
            mistake: { type: String, required: true },
            correction: { type: String, required: true },
            explanation: { type: String, required: true }
        }],
    practiceExamples: [{
            german: { type: String, required: true },
            english: { type: String, required: true },
            audioUrl: { type: String }
        }],
    audioUrl: { type: String },
    audioStatus: {
        type: String,
        enum: ['pending', 'generating', 'ready', 'error'],
        default: 'pending'
    },
    estimatedTime: { type: Number, default: 10 },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
grammarLessonSchema.index({ topic: 1, order: 1 });
grammarLessonSchema.index({ difficulty: 1 });
grammarLessonSchema.index({ isPublished: 1, isDeleted: 1 });
grammarLessonSchema.index({ title: 'text', titleDe: 'text', introduction: 'text' });
exports.GrammarLesson = (0, mongoose_1.model)('GrammarLesson', grammarLessonSchema);
const baseExerciseSchema = {
    type: {
        type: String,
        enum: [
            'fill-blank', 'multiple-choice', 'matching', 'word-order',
            'conjugation', 'case-selection', 'article-selection',
            'translation', 'error-correction'
        ],
        required: true
    },
    instruction: { type: String, required: true },
    instructionDe: { type: String, required: true },
    difficulty: {
        type: String,
        enum: user_constant_1.GERMAN_LEVELS,
        required: true
    },
    points: { type: Number, default: 10 },
    hint: { type: String },
    hintDe: { type: String },
    explanation: { type: String, required: true },
    explanationDe: { type: String, required: true },
};
const exerciseSchema = new mongoose_1.Schema({
    ...baseExerciseSchema,
    sentence: { type: String },
    sentenceTranslation: { type: String },
    correctAnswer: { type: String },
    acceptableAnswers: [{ type: String }],
    question: { type: String },
    questionTranslation: { type: String },
    options: [{
            text: { type: String },
            isCorrect: { type: Boolean }
        }],
    pairs: [{
            left: { type: String },
            right: { type: String }
        }],
    words: [{ type: String }],
    correctOrder: [{ type: String }],
    translation: { type: String },
    verb: { type: String },
    tense: { type: String },
    pronoun: { type: String },
    verbTranslation: { type: String },
    targetWord: { type: String },
    correctCase: {
        type: String,
        enum: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv']
    },
    noun: { type: String },
    nounGender: {
        type: String,
        enum: ['masculine', 'feminine', 'neuter']
    },
    caseUsed: {
        type: String,
        enum: ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv']
    },
    sourceLanguage: {
        type: String,
        enum: ['de', 'en']
    },
    sourceText: { type: String },
    correctTranslations: [{ type: String }],
    keyWords: [{ type: String }],
    incorrectSentence: { type: String },
    correctSentence: { type: String },
    errorType: { type: String },
}, { _id: true });
const grammarExerciseSetSchema = new mongoose_1.Schema({
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GrammarLesson', required: true },
    title: { type: String, required: true, trim: true },
    titleDe: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    difficulty: {
        type: String,
        enum: user_constant_1.GERMAN_LEVELS,
        required: true
    },
    exercises: [exerciseSchema],
    passingScore: { type: Number, default: 70 },
    timeLimit: { type: Number },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
grammarExerciseSetSchema.index({ lesson: 1, order: 1 });
grammarExerciseSetSchema.index({ isPublished: 1, isDeleted: 1 });
exports.GrammarExerciseSet = (0, mongoose_1.model)('GrammarExerciseSet', grammarExerciseSetSchema);
const grammarLessonProgressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GrammarLesson', required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    timeSpent: { type: Number, default: 0 },
    revisitCount: { type: Number, default: 0 },
    lastVisitedAt: { type: Date, default: Date.now },
}, { timestamps: true });
grammarLessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });
exports.GrammarLessonProgress = (0, mongoose_1.model)('GrammarLessonProgress', grammarLessonProgressSchema);
const exerciseAttemptSchema = new mongoose_1.Schema({
    attemptNumber: { type: Number, required: true },
    score: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeSpent: { type: Number, required: true },
    answers: [{
            exerciseIndex: { type: Number, required: true },
            userAnswer: { type: mongoose_1.Schema.Types.Mixed, required: true },
            isCorrect: { type: Boolean, required: true },
            pointsEarned: { type: Number, default: 0 }
        }],
    completedAt: { type: Date, default: Date.now }
}, { _id: true });
const grammarExerciseProgressSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    exerciseSet: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GrammarExerciseSet', required: true },
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GrammarLesson', required: true },
    attempts: [exerciseAttemptSchema],
    bestScore: { type: Number, default: 0 },
    isPassed: { type: Boolean, default: false },
    masteryLevel: {
        type: String,
        enum: ['learning', 'practicing', 'mastered'],
        default: 'learning'
    },
}, { timestamps: true });
grammarExerciseProgressSchema.index({ user: 1, exerciseSet: 1 }, { unique: true });
grammarExerciseProgressSchema.index({ user: 1, lesson: 1 });
exports.GrammarExerciseProgress = (0, mongoose_1.model)('GrammarExerciseProgress', grammarExerciseProgressSchema);
const grammarTopicMasterySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: mongoose_1.Schema.Types.ObjectId, ref: 'GrammarTopic', required: true },
    lessonsCompleted: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    exercisesPassed: { type: Number, default: 0 },
    totalExercises: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    masteryLevel: {
        type: String,
        enum: ['not-started', 'beginner', 'intermediate', 'advanced', 'mastered'],
        default: 'not-started'
    },
    lastActivityAt: { type: Date, default: Date.now },
}, { timestamps: true });
grammarTopicMasterySchema.index({ user: 1, topic: 1 }, { unique: true });
grammarTopicMasterySchema.index({ user: 1, masteryLevel: 1 });
exports.GrammarTopicMastery = (0, mongoose_1.model)('GrammarTopicMastery', grammarTopicMasterySchema);
//# sourceMappingURL=grammar.model.js.map