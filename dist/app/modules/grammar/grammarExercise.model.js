"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarExercise = void 0;
const mongoose_1 = require("mongoose");
const grammar_interface_1 = require("./grammar.interface");
const multipleChoiceOptionSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: [true, 'Option text is required'],
        trim: true
    },
    isCorrect: {
        type: Boolean,
        required: true,
        default: false
    },
    explanation: {
        type: String,
        trim: true
    },
}, { _id: false });
const fillInBlankSchema = new mongoose_1.Schema({
    sentence: {
        type: String,
        required: [true, 'Sentence with blank is required'],
        trim: true
    },
    correctAnswer: {
        type: String,
        required: [true, 'Correct answer is required'],
        trim: true
    },
    acceptableAnswers: [{
            type: String,
            trim: true
        }],
    hint: {
        type: String,
        trim: true
    },
}, { _id: false });
const grammarExerciseSchema = new mongoose_1.Schema({
    topic: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'GrammarTopic',
        required: [true, 'Topic reference is required'],
        index: true
    },
    type: {
        type: String,
        enum: {
            values: grammar_interface_1.EXERCISE_TYPES,
            message: '{VALUE} is not a valid exercise type'
        },
        required: [true, 'Exercise type is required'],
        index: true
    },
    question: {
        type: String,
        required: [true, 'Question is required'],
        trim: true,
        maxlength: [500, 'Question cannot exceed 500 characters']
    },
    instruction: {
        type: String,
        trim: true,
        maxlength: [300, 'Instruction cannot exceed 300 characters']
    },
    options: {
        type: [multipleChoiceOptionSchema],
        validate: {
            validator: function (options) {
                if (this.type !== 'multiple-choice')
                    return true;
                if (options.length < 2 || options.length > 6)
                    return false;
                const correctCount = options.filter(opt => opt.isCorrect).length;
                return correctCount === 1;
            },
            message: 'Multiple choice must have 2-6 options with exactly one correct answer'
        }
    },
    fillInBlank: {
        type: fillInBlankSchema,
        validate: {
            validator: function (fillInBlank) {
                if (this.type !== 'fill-in-the-blank')
                    return true;
                return fillInBlank && fillInBlank.sentence && fillInBlank.sentence.includes('___');
            },
            message: 'Fill in the blank must have a sentence with ___ marker'
        }
    },
    explanation: {
        type: String,
        required: [true, 'Explanation is required'],
        trim: true
    },
    difficulty: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,
        index: true
    },
    points: {
        type: Number,
        default: 10,
        min: [1, 'Points must be at least 1'],
        max: [100, 'Points cannot exceed 100']
    },
    order: {
        type: Number,
        default: 0,
        index: true
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
grammarExerciseSchema.index({ topic: 1, order: 1 });
grammarExerciseSchema.index({ topic: 1, type: 1, isPublished: 1 });
grammarExerciseSchema.index({ difficulty: 1, isPublished: 1 });
grammarExerciseSchema.index({ isPublished: 1, isDeleted: 1 });
grammarExerciseSchema.pre('save', function (next) {
    if (this.type === 'multiple-choice' && (!this.options || this.options.length === 0)) {
        return next(new Error('Multiple choice exercises must have options'));
    }
    if (this.type === 'fill-in-the-blank' && !this.fillInBlank) {
        return next(new Error('Fill in the blank exercises must have fillInBlank data'));
    }
    next();
});
exports.GrammarExercise = (0, mongoose_1.model)('GrammarExercise', grammarExerciseSchema);
//# sourceMappingURL=grammarExercise.model.js.map