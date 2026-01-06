export declare const AnalyticsServices: {
    getStudentAnalytics: (userId: string) => Promise<{
        totalWords: number;
        completedLessons: number;
        coins: number;
        currentLevel: "A1" | "A2" | "B1" | "B2" | "C1" | null;
    }>;
    getLeaderboard: () => Promise<(import("mongoose").Document<unknown, {}, import("../student/student.interface").IStudent, {}, import("mongoose").DefaultSchemaOptions> & import("../student/student.interface").IStudent & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getAdminStats: () => Promise<{
        totalStudents: number;
        totalLessons: number;
        publishedLessons: number;
    }>;
    getAllLessonsForAdmin: (query: Record<string, unknown>) => Promise<(import("mongoose").Document<unknown, {}, import("../lesson/lesson.interface").ILesson, {}, import("mongoose").DefaultSchemaOptions> & import("../lesson/lesson.interface").ILesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
};
//# sourceMappingURL=analytics.service.d.ts.map