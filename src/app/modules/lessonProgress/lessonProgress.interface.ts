import { Types } from 'mongoose';

export interface ILessonProgress {
  user: Types.ObjectId;   // Who read it?
  lesson: Types.ObjectId; // What did they read?
  isCompleted: boolean;
  completedAt?: Date;
}