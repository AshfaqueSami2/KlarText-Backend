import { Schema, model } from 'mongoose';
import { ILessonProgress } from './lessonProgress.interface';

const lessonProgressSchema = new Schema<ILessonProgress>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  isCompleted: { type: Boolean, default: true },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// ✅ Compound Index: Ensure a user can't "finish" the same lesson twice to spam coins
lessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });

export const LessonProgress = model<ILessonProgress>('LessonProgress', lessonProgressSchema);