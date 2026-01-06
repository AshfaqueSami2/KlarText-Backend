import { Types } from 'mongoose';
import { GERMAN_LEVELS } from '../user/user.constant';
export type TGrammarDifficulty = (typeof GERMAN_LEVELS)[number];
export interface IGrammarTopic {
    title: string;
    titleDe: string;
    slug: string;
    description: string;
    descriptionDe: string;
    icon: string;
    difficulty: TGrammarDifficulty;
    order: number;
    coverImage?: string;
    isPublished: boolean;
    isDeleted: boolean;
    lessonCount?: number;
}
export type TExplanationType = 'text' | 'table' | 'example' | 'tip' | 'warning' | 'comparison';
export interface IGrammarExplanationBlock {
    type: TExplanationType;
    title?: string;
    titleDe?: string;
    content: string;
    contentDe: string;
    tableData?: {
        headers: string[];
        rows: string[][];
    };
    examples?: {
        german: string;
        english: string;
        breakdown?: string;
        audioUrl?: string;
    }[];
}
export interface IGrammarLesson {
    topic: Types.ObjectId;
    title: string;
    titleDe: string;
    slug: string;
    difficulty: TGrammarDifficulty;
    order: number;
    introduction: string;
    introductionDe: string;
    explanationBlocks: IGrammarExplanationBlock[];
    keyPoints: {
        point: string;
        pointDe: string;
    }[];
    commonMistakes?: {
        mistake: string;
        correction: string;
        explanation: string;
    }[];
    practiceExamples: {
        german: string;
        english: string;
        audioUrl?: string;
    }[];
    audioUrl?: string;
    audioStatus?: 'pending' | 'generating' | 'ready' | 'error';
    estimatedTime: number;
    isPublished: boolean;
    isDeleted: boolean;
}
export type TExerciseType = 'fill-blank' | 'multiple-choice' | 'matching' | 'word-order' | 'conjugation' | 'case-selection' | 'article-selection' | 'translation' | 'error-correction';
export interface IBaseExercise {
    type: TExerciseType;
    instruction: string;
    instructionDe: string;
    difficulty: TGrammarDifficulty;
    points: number;
    hint?: string;
    hintDe?: string;
    explanation: string;
    explanationDe: string;
}
export interface IFillBlankExercise extends IBaseExercise {
    type: 'fill-blank';
    sentence: string;
    sentenceTranslation: string;
    correctAnswer: string;
    acceptableAnswers?: string[];
}
export interface IMultipleChoiceExercise extends IBaseExercise {
    type: 'multiple-choice';
    question: string;
    questionTranslation: string;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
}
export interface IMatchingExercise extends IBaseExercise {
    type: 'matching';
    pairs: {
        left: string;
        right: string;
    }[];
}
export interface IWordOrderExercise extends IBaseExercise {
    type: 'word-order';
    words: string[];
    correctOrder: string[];
    translation: string;
}
export interface IConjugationExercise extends IBaseExercise {
    type: 'conjugation';
    verb: string;
    tense: string;
    pronoun: string;
    correctAnswer: string;
    verbTranslation: string;
}
export interface ICaseSelectionExercise extends IBaseExercise {
    type: 'case-selection';
    sentence: string;
    sentenceTranslation: string;
    targetWord: string;
    correctCase: 'Nominativ' | 'Akkusativ' | 'Dativ' | 'Genitiv';
}
export interface IArticleSelectionExercise extends IBaseExercise {
    type: 'article-selection';
    sentence: string;
    sentenceTranslation: string;
    options: string[];
    correctAnswer: string;
    noun: string;
    nounGender: 'masculine' | 'feminine' | 'neuter';
    caseUsed: 'Nominativ' | 'Akkusativ' | 'Dativ' | 'Genitiv';
}
export interface ITranslationExercise extends IBaseExercise {
    type: 'translation';
    sourceLanguage: 'de' | 'en';
    sourceText: string;
    correctTranslations: string[];
    keyWords?: string[];
}
export interface IErrorCorrectionExercise extends IBaseExercise {
    type: 'error-correction';
    incorrectSentence: string;
    correctSentence: string;
    errorType: string;
    translation: string;
}
export type TGrammarExercise = IFillBlankExercise | IMultipleChoiceExercise | IMatchingExercise | IWordOrderExercise | IConjugationExercise | ICaseSelectionExercise | IArticleSelectionExercise | ITranslationExercise | IErrorCorrectionExercise;
export interface IGrammarExerciseSet {
    lesson: Types.ObjectId;
    title: string;
    titleDe: string;
    slug: string;
    difficulty: TGrammarDifficulty;
    exercises: TGrammarExercise[];
    passingScore: number;
    timeLimit?: number;
    order: number;
    isPublished: boolean;
    isDeleted: boolean;
}
export interface IGrammarLessonProgress {
    user: Types.ObjectId;
    lesson: Types.ObjectId;
    isCompleted: boolean;
    completedAt?: Date;
    timeSpent: number;
    revisitCount: number;
    lastVisitedAt: Date;
}
export interface IGrammarExerciseProgress {
    user: Types.ObjectId;
    exerciseSet: Types.ObjectId;
    lesson: Types.ObjectId;
    attempts: {
        attemptNumber: number;
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        timeSpent: number;
        answers: {
            exerciseIndex: number;
            userAnswer: string | string[];
            isCorrect: boolean;
            pointsEarned: number;
        }[];
        completedAt: Date;
    }[];
    bestScore: number;
    isPassed: boolean;
    masteryLevel: 'learning' | 'practicing' | 'mastered';
}
export interface IGrammarTopicMastery {
    user: Types.ObjectId;
    topic: Types.ObjectId;
    lessonsCompleted: number;
    totalLessons: number;
    exercisesPassed: number;
    totalExercises: number;
    averageScore: number;
    masteryLevel: 'not-started' | 'beginner' | 'intermediate' | 'advanced' | 'mastered';
    lastActivityAt: Date;
}
//# sourceMappingURL=grammar.interface.d.ts.map