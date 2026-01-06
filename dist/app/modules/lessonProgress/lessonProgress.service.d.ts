import mongoose from 'mongoose';
export declare const LessonProgressServices: {
    markLessonAsComplete: (userId: string, lessonId: string) => Promise<{
        levelPromoted: boolean;
        oldLevel: string;
        newLevel: string;
        promotionBonus: number;
        promotionMessage: string;
        progress?: never;
        message: string;
        awardedCoins: number;
        newBalance: number;
    } | {
        levelPromoted: boolean;
        progress: string;
        oldLevel?: never;
        newLevel?: never;
        promotionBonus?: never;
        promotionMessage?: never;
        message: string;
        awardedCoins: number;
        newBalance: number;
    }>;
    reviewCompletedLesson: (userId: string, lessonId: string) => Promise<{
        lesson: mongoose.Document<unknown, {}, import("../lesson/lesson.interface").ILesson, {}, mongoose.DefaultSchemaOptions> & import("../lesson/lesson.interface").ILesson & {
            _id: mongoose.Types.ObjectId;
        } & {
            __v: number;
        };
        completedAt: Date | undefined;
        message: string;
    }>;
    getStudentProgress: (userId: string) => Promise<{
        totalCompleted: number;
        totalInCurrentLevel: number;
        progressPercentage: number;
        currentLevel: "A1" | "A2" | "B1" | "B2" | "C1" | null;
        completedLessons: never[];
    } | {
        totalCompleted: number;
        totalInCurrentLevel: number;
        progressPercentage: number;
        currentLevel: "A1" | "A2" | "B1" | "B2" | "C1";
        completedLessons: {
            lesson: mongoose.Types.ObjectId;
            completedAt: Date | undefined;
            canReview: boolean;
        }[];
    }>;
    getAvailableLessons: (userId: string) => Promise<{
        message: string;
        availableLessons: never[];
        needsLevelSelection: boolean;
        subscriptionStatus: "free" | "premium";
        currentLevel?: never;
        subscriptionPlan?: never;
        isPremium?: never;
        totalAvailable?: never;
        completed?: never;
        freeLessons?: never;
        premiumLessons?: never;
        lockedLessons?: never;
    } | {
        currentLevel: "A1" | "A2" | "B1" | "B2" | "C1";
        subscriptionStatus: "free" | "premium";
        subscriptionPlan: "monthly" | "yearly" | "lifetime" | null | undefined;
        isPremium: boolean;
        availableLessons: {
            isCompleted: boolean;
            isPremium: boolean;
            canAccess: boolean;
            requiresUpgrade: boolean;
            lockReason: string | null;
            title: string;
            slug: string;
            content: string;
            difficulty: import("../lesson/lesson.interface").TLessonDifficulty;
            coverImage?: string;
            audioUrl?: string;
            audioStatus?: "pending" | "generating" | "ready" | "error";
            isPublished: boolean;
            isDeleted: boolean;
            admin: mongoose.Types.ObjectId;
            _id: mongoose.Types.ObjectId;
            __v: number;
        }[];
        totalAvailable: number;
        completed: number;
        freeLessons: number;
        premiumLessons: number;
        lockedLessons: number;
        message?: never;
        needsLevelSelection?: never;
    }>;
};
//# sourceMappingURL=lessonProgress.service.d.ts.map