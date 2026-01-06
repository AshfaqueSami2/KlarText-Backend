import { Types } from 'mongoose';
import { IGrammarTopic, IGrammarLesson, IGrammarExerciseSet, TGrammarExercise } from './grammar.interface';
export declare const GrammarServices: {
    createTopic: (payload: IGrammarTopic) => Promise<import("mongoose").Document<unknown, {}, IGrammarTopic, {}, import("mongoose").DefaultSchemaOptions> & IGrammarTopic & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllTopics: (query: Record<string, unknown>) => Promise<{
        data: (IGrammarTopic & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getTopicByIdOrSlug: (identifier: string) => Promise<IGrammarTopic & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTopic: (id: string, payload: Partial<IGrammarTopic>) => Promise<import("mongoose").Document<unknown, {}, IGrammarTopic, {}, import("mongoose").DefaultSchemaOptions> & IGrammarTopic & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteTopic: (id: string) => Promise<import("mongoose").Document<unknown, {}, IGrammarTopic, {}, import("mongoose").DefaultSchemaOptions> & IGrammarTopic & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createLesson: (payload: IGrammarLesson) => Promise<import("mongoose").Document<unknown, {}, IGrammarLesson, {}, import("mongoose").DefaultSchemaOptions> & IGrammarLesson & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getLessonsByTopic: (topicId: string, query: Record<string, unknown>) => Promise<{
        data: (IGrammarLesson & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getLessonByIdOrSlug: (identifier: string, userId?: string) => Promise<{
        progress: (import("./grammar.interface").IGrammarLessonProgress & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) | null;
        exerciseSets: {
            exerciseCount: any;
            lesson: Types.ObjectId;
            title: string;
            titleDe: string;
            slug: string;
            difficulty: import("./grammar.interface").TGrammarDifficulty;
            exercises: TGrammarExercise[];
            passingScore: number;
            timeLimit?: number;
            order: number;
            isPublished: boolean;
            isDeleted: boolean;
            _id: Types.ObjectId;
            __v: number;
        }[];
        topic: Types.ObjectId;
        title: string;
        titleDe: string;
        slug: string;
        difficulty: import("./grammar.interface").TGrammarDifficulty;
        order: number;
        introduction: string;
        introductionDe: string;
        explanationBlocks: import("./grammar.interface").IGrammarExplanationBlock[];
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
        audioStatus?: "pending" | "generating" | "ready" | "error";
        estimatedTime: number;
        isPublished: boolean;
        isDeleted: boolean;
        _id: Types.ObjectId;
        __v: number;
    }>;
    updateLesson: (id: string, payload: Partial<IGrammarLesson>) => Promise<import("mongoose").Document<unknown, {}, IGrammarLesson, {}, import("mongoose").DefaultSchemaOptions> & IGrammarLesson & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteLesson: (id: string) => Promise<import("mongoose").Document<unknown, {}, IGrammarLesson, {}, import("mongoose").DefaultSchemaOptions> & IGrammarLesson & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    createExerciseSet: (payload: IGrammarExerciseSet) => Promise<import("mongoose").Document<unknown, {}, IGrammarExerciseSet, {}, import("mongoose").DefaultSchemaOptions> & IGrammarExerciseSet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getExerciseSetsByLesson: (lessonId: string, query: Record<string, unknown>) => Promise<{
        exerciseCount: number;
        lesson: Types.ObjectId;
        title: string;
        titleDe: string;
        slug: string;
        difficulty: import("./grammar.interface").TGrammarDifficulty;
        exercises: TGrammarExercise[];
        passingScore: number;
        timeLimit?: number;
        order: number;
        isPublished: boolean;
        isDeleted: boolean;
        _id: Types.ObjectId;
        __v: number;
    }[]>;
    getExerciseSetById: (id: string, userId?: string) => Promise<{
        progress: (import("./grammar.interface").IGrammarExerciseProgress & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        }) | null;
        lesson: Types.ObjectId;
        title: string;
        titleDe: string;
        slug: string;
        difficulty: import("./grammar.interface").TGrammarDifficulty;
        exercises: TGrammarExercise[];
        passingScore: number;
        timeLimit?: number;
        order: number;
        isPublished: boolean;
        isDeleted: boolean;
        _id: Types.ObjectId;
        __v: number;
    }>;
    updateExerciseSet: (id: string, payload: Partial<IGrammarExerciseSet>) => Promise<import("mongoose").Document<unknown, {}, IGrammarExerciseSet, {}, import("mongoose").DefaultSchemaOptions> & IGrammarExerciseSet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    deleteExerciseSet: (id: string) => Promise<import("mongoose").Document<unknown, {}, IGrammarExerciseSet, {}, import("mongoose").DefaultSchemaOptions> & IGrammarExerciseSet & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    submitExerciseAnswers: (userId: string, exerciseSetId: string, answers: {
        exerciseIndex: number;
        userAnswer: string | string[];
    }[], timeSpent: number) => Promise<{
        score: number;
        correctAnswers: number;
        totalQuestions: number;
        isPassed: boolean;
        masteryLevel: "learning" | "practicing" | "mastered";
        gradedAnswers: {
            exercise: TGrammarExercise;
            exerciseIndex: number;
            userAnswer: string | string[];
            isCorrect: boolean;
            pointsEarned: number;
        }[];
        attemptNumber: number;
        bestScore: number;
    }>;
    updateLessonProgress: (userId: string, lessonId: string, timeSpent?: number, isCompleted?: boolean) => Promise<import("mongoose").Document<unknown, {}, import("./grammar.interface").IGrammarLessonProgress, {}, import("mongoose").DefaultSchemaOptions> & import("./grammar.interface").IGrammarLessonProgress & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    getUserGrammarProgress: (userId: string) => Promise<{
        overview: {
            totalLessonsCompleted: number;
            totalExercisesPassed: number;
            totalTimeSpent: number;
            averageExerciseScore: number;
        };
        topicMasteries: (import("./grammar.interface").IGrammarTopicMastery & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
        recentActivity: (import("./grammar.interface").IGrammarLessonProgress & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getRecommendedLesson: (userId: string, difficulty?: string) => Promise<(IGrammarLesson & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=grammar.service.d.ts.map