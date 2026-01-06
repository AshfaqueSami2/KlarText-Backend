"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarTopic = void 0;
const mongoose_1 = require("mongoose");
const grammar_interface_1 = require("./grammar.interface");
const grammarExampleSchema = new mongoose_1.Schema({
    germanText: {
        type: String,
        required: [true, 'German text is required'],
        trim: true
    },
    englishTranslation: {
        type: String,
        required: [true, 'English translation is required'],
        trim: true
    },
    grammarNote: {
        type: String,
        trim: true
    },
    audioUrl: {
        type: String
    },
}, { _id: false });
const grammarTopicSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    level: {
        type: String,
        enum: {
            values: grammar_interface_1.GRAMMAR_LEVELS,
            message: '{VALUE} is not a valid level. Must be one of: ' + grammar_interface_1.GRAMMAR_LEVELS.join(', ')
        },
        required: [true, 'Level is required'],
        index: true
    },
    category: {
        type: String,
        enum: {
            values: grammar_interface_1.GRAMMAR_CATEGORIES,
            message: '{VALUE} is not a valid category'
        },
        required: [true, 'Category is required'],
        index: true
    },
    explanation: {
        type: String,
        required: [true, 'Explanation is required']
    },
    examples: {
        type: [grammarExampleSchema],
        default: [],
        validate: {
            validator: function (examples) {
                return examples.length <= 50;
            },
            message: 'A topic cannot have more than 50 examples'
        }
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
grammarTopicSchema.index({ level: 1, category: 1, isPublished: 1 });
grammarTopicSchema.index({ level: 1, order: 1 });
grammarTopicSchema.index({ isPublished: 1, isDeleted: 1 });
grammarTopicSchema.index({ createdAt: -1 });
grammarTopicSchema.index({
    title: 'text',
    explanation: 'text',
    'examples.germanText': 'text',
    'examples.englishTranslation': 'text'
});
grammarTopicSchema.virtual('exercises', {
    ref: 'GrammarExercise',
    localField: '_id',
    foreignField: 'topic',
    options: { sort: { order: 1 } }
});
grammarTopicSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[äÄ]/g, 'ae')
            .replace(/[öÖ]/g, 'oe')
            .replace(/[üÜ]/g, 'ue')
            .replace(/ß/g, 'ss')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});
exports.GrammarTopic = (0, mongoose_1.model)('GrammarTopic', grammarTopicSchema);
//# sourceMappingURL=grammarTopic.model.js.map