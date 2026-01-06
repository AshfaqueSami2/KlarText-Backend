"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("../user/user.constant");
const createTopicSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, 'Title must be at least 3 characters'),
        titleDe: zod_1.z.string().min(3, 'German title must be at least 3 characters'),
        slug: zod_1.z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
        description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
        descriptionDe: zod_1.z.string().min(10, 'German description must be at least 10 characters'),
        icon: zod_1.z.string().optional(),
        difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]),
        order: zod_1.z.number().int().min(0).optional(),
        coverImage: zod_1.z.string().url().optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
const updateTopicSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        titleDe: zod_1.z.string().min(3).optional(),
        slug: zod_1.z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
        description: zod_1.z.string().min(10).optional(),
        descriptionDe: zod_1.z.string().min(10).optional(),
        icon: zod_1.z.string().optional(),
        difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]).optional(),
        order: zod_1.z.number().int().min(0).optional(),
        coverImage: zod_1.z.string().url().optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
const explanationBlockSchema = zod_1.z.object({
    type: zod_1.z.enum(['text', 'table', 'example', 'tip', 'warning', 'comparison']),
    title: zod_1.z.string().optional(),
    titleDe: zod_1.z.string().optional(),
    content: zod_1.z.string().min(5),
    contentDe: zod_1.z.string().min(5),
    tableData: zod_1.z.object({
        headers: zod_1.z.array(zod_1.z.string()),
        rows: zod_1.z.array(zod_1.z.array(zod_1.z.string())),
    }).optional(),
    examples: zod_1.z.array(zod_1.z.object({
        german: zod_1.z.string(),
        english: zod_1.z.string(),
        breakdown: zod_1.z.string().optional(),
        audioUrl: zod_1.z.string().url().optional(),
    })).optional(),
});
const keyPointSchema = zod_1.z.object({
    point: zod_1.z.string().min(5),
    pointDe: zod_1.z.string().min(5),
});
const commonMistakeSchema = zod_1.z.object({
    mistake: zod_1.z.string().min(3),
    correction: zod_1.z.string().min(3),
    explanation: zod_1.z.string().min(10),
});
const practiceExampleSchema = zod_1.z.object({
    german: zod_1.z.string().min(3),
    english: zod_1.z.string().min(3),
    audioUrl: zod_1.z.string().url().optional(),
});
const createLessonSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z.string().min(24, 'Valid topic ID required'),
        title: zod_1.z.string().min(3),
        titleDe: zod_1.z.string().min(3),
        slug: zod_1.z.string().min(3).regex(/^[a-z0-9-]+$/),
        difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]),
        order: zod_1.z.number().int().min(0).optional(),
        introduction: zod_1.z.string().min(20, 'Introduction must be at least 20 characters'),
        introductionDe: zod_1.z.string().min(20),
        explanationBlocks: zod_1.z.array(explanationBlockSchema).min(1, 'At least one explanation block required'),
        keyPoints: zod_1.z.array(keyPointSchema).min(1, 'At least one key point required'),
        commonMistakes: zod_1.z.array(commonMistakeSchema).optional(),
        practiceExamples: zod_1.z.array(practiceExampleSchema).min(1, 'At least one practice example required'),
        estimatedTime: zod_1.z.number().int().min(1).max(120).optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
const updateLessonSchema = zod_1.z.object({
    body: zod_1.z.object({
        topic: zod_1.z.string().min(24).optional(),
        title: zod_1.z.string().min(3).optional(),
        titleDe: zod_1.z.string().min(3).optional(),
        slug: zod_1.z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
        difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]).optional(),
        order: zod_1.z.number().int().min(0).optional(),
        introduction: zod_1.z.string().min(20).optional(),
        introductionDe: zod_1.z.string().min(20).optional(),
        explanationBlocks: zod_1.z.array(explanationBlockSchema).optional(),
        keyPoints: zod_1.z.array(keyPointSchema).optional(),
        commonMistakes: zod_1.z.array(commonMistakeSchema).optional(),
        practiceExamples: zod_1.z.array(practiceExampleSchema).optional(),
        estimatedTime: zod_1.z.number().int().min(1).max(120).optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
const baseExerciseFields = {
    instruction: zod_1.z.string().min(10),
    instructionDe: zod_1.z.string().min(10),
    difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]),
    points: zod_1.z.number().int().min(1).max(100).optional(),
    hint: zod_1.z.string().optional(),
    hintDe: zod_1.z.string().optional(),
    explanation: zod_1.z.string().min(10),
    explanationDe: zod_1.z.string().min(10),
};
const fillBlankExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('fill-blank'),
    ...baseExerciseFields,
    sentence: zod_1.z.string().min(5).refine((s) => s.includes('___'), {
        message: 'Sentence must contain ___ for blank',
    }),
    sentenceTranslation: zod_1.z.string().min(5),
    correctAnswer: zod_1.z.string().min(1),
    acceptableAnswers: zod_1.z.array(zod_1.z.string()).optional(),
});
const multipleChoiceExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('multiple-choice'),
    ...baseExerciseFields,
    question: zod_1.z.string().min(5),
    questionTranslation: zod_1.z.string().min(5),
    options: zod_1.z.array(zod_1.z.object({
        text: zod_1.z.string().min(1),
        isCorrect: zod_1.z.boolean(),
    })).min(2).max(6).refine((opts) => opts.filter(o => o.isCorrect).length >= 1, {
        message: 'At least one option must be correct',
    }),
});
const matchingExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('matching'),
    ...baseExerciseFields,
    pairs: zod_1.z.array(zod_1.z.object({
        left: zod_1.z.string().min(1),
        right: zod_1.z.string().min(1),
    })).min(3).max(8),
});
const wordOrderExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('word-order'),
    ...baseExerciseFields,
    words: zod_1.z.array(zod_1.z.string()).min(3),
    correctOrder: zod_1.z.array(zod_1.z.string()).min(3),
    translation: zod_1.z.string().min(5),
});
const conjugationExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('conjugation'),
    ...baseExerciseFields,
    verb: zod_1.z.string().min(2),
    tense: zod_1.z.string().min(3),
    pronoun: zod_1.z.string().min(1),
    correctAnswer: zod_1.z.string().min(1),
    verbTranslation: zod_1.z.string().min(2),
});
const caseSelectionExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('case-selection'),
    ...baseExerciseFields,
    sentence: zod_1.z.string().min(5),
    sentenceTranslation: zod_1.z.string().min(5),
    targetWord: zod_1.z.string().min(1),
    correctCase: zod_1.z.enum(['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv']),
});
const articleSelectionExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('article-selection'),
    ...baseExerciseFields,
    sentence: zod_1.z.string().min(5).refine((s) => s.includes('___'), {
        message: 'Sentence must contain ___ for blank',
    }),
    sentenceTranslation: zod_1.z.string().min(5),
    options: zod_1.z.array(zod_1.z.string()).min(2),
    correctAnswer: zod_1.z.string().min(1),
    noun: zod_1.z.string().min(1),
    nounGender: zod_1.z.enum(['masculine', 'feminine', 'neuter']),
    caseUsed: zod_1.z.enum(['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv']),
});
const translationExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('translation'),
    ...baseExerciseFields,
    sourceLanguage: zod_1.z.enum(['de', 'en']),
    sourceText: zod_1.z.string().min(3),
    correctTranslations: zod_1.z.array(zod_1.z.string()).min(1),
    keyWords: zod_1.z.array(zod_1.z.string()).optional(),
});
const errorCorrectionExerciseSchema = zod_1.z.object({
    type: zod_1.z.literal('error-correction'),
    ...baseExerciseFields,
    incorrectSentence: zod_1.z.string().min(5),
    correctSentence: zod_1.z.string().min(5),
    errorType: zod_1.z.string().min(3),
    translation: zod_1.z.string().min(5),
});
const exerciseSchema = zod_1.z.discriminatedUnion('type', [
    fillBlankExerciseSchema,
    multipleChoiceExerciseSchema,
    matchingExerciseSchema,
    wordOrderExerciseSchema,
    conjugationExerciseSchema,
    caseSelectionExerciseSchema,
    articleSelectionExerciseSchema,
    translationExerciseSchema,
    errorCorrectionExerciseSchema,
]);
const createExerciseSetSchema = zod_1.z.object({
    body: zod_1.z.object({
        lesson: zod_1.z.string().min(24, 'Valid lesson ID required'),
        title: zod_1.z.string().min(3),
        titleDe: zod_1.z.string().min(3),
        slug: zod_1.z.string().min(3).regex(/^[a-z0-9-]+$/),
        difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]),
        exercises: zod_1.z.array(exerciseSchema).min(1, 'At least one exercise required').max(50),
        passingScore: zod_1.z.number().int().min(50).max(100).optional(),
        timeLimit: zod_1.z.number().int().min(1).max(120).optional(),
        order: zod_1.z.number().int().min(0).optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
const updateExerciseSetSchema = zod_1.z.object({
    body: zod_1.z.object({
        lesson: zod_1.z.string().min(24).optional(),
        title: zod_1.z.string().min(3).optional(),
        titleDe: zod_1.z.string().min(3).optional(),
        slug: zod_1.z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
        difficulty: zod_1.z.enum([...user_constant_1.GERMAN_LEVELS]).optional(),
        exercises: zod_1.z.array(exerciseSchema).max(50).optional(),
        passingScore: zod_1.z.number().int().min(50).max(100).optional(),
        timeLimit: zod_1.z.number().int().min(1).max(120).optional(),
        order: zod_1.z.number().int().min(0).optional(),
        isPublished: zod_1.z.boolean().optional(),
    }),
});
const submitExerciseAnswersSchema = zod_1.z.object({
    body: zod_1.z.object({
        answers: zod_1.z.array(zod_1.z.object({
            exerciseIndex: zod_1.z.number().int().min(0),
            userAnswer: zod_1.z.union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())]),
        })).min(1),
        timeSpent: zod_1.z.number().int().min(0),
    }),
});
const updateLessonProgressSchema = zod_1.z.object({
    body: zod_1.z.object({
        timeSpent: zod_1.z.number().int().min(0).optional(),
        isCompleted: zod_1.z.boolean().optional(),
    }),
});
exports.GrammarValidation = {
    createTopicSchema,
    updateTopicSchema,
    createLessonSchema,
    updateLessonSchema,
    createExerciseSetSchema,
    updateExerciseSetSchema,
    submitExerciseAnswersSchema,
    updateLessonProgressSchema,
};
//# sourceMappingURL=grammar.validation.js.map