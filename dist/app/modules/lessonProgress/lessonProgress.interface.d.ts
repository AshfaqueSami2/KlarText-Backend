import { Types } from 'mongoose';
export interface ILessonProgress {
    user: Types.ObjectId;
    lesson: Types.ObjectId;
    isCompleted: boolean;
    completedAt?: Date;
}
//# sourceMappingURL=lessonProgress.interface.d.ts.map