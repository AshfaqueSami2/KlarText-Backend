import { ILesson } from './lesson.interface';
export declare const LessonServices: {
    createLessonIntoDB: (payload: ILesson) => Promise<import("mongoose").Document<unknown, {}, ILesson, {}, import("mongoose").DefaultSchemaOptions> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllLessonsFromDB: (query: Record<string, unknown>) => Promise<{
        data: (ILesson & {
            _id: import("mongoose").Types.ObjectId;
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
    updateLessonInDB: (id: string, payload: Partial<ILesson>) => Promise<(import("mongoose").Document<unknown, {}, ILesson, {}, import("mongoose").DefaultSchemaOptions> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    deleteLessonFromDB: (id: string) => Promise<(import("mongoose").Document<unknown, {}, ILesson, {}, import("mongoose").DefaultSchemaOptions> & ILesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getLessonByIdFromDB: (id: string) => Promise<(ILesson & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    regenerateAudioForLesson: (id: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=lesson.service.d.ts.map