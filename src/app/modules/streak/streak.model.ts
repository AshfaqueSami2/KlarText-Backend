import { Schema, model } from 'mongoose';
import { IStreak } from './streak.interface';

const streakSchema = new Schema<IStreak>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate: { type: Date, default: null },
  totalActiveDays: { type: Number, default: 0 },
}, { timestamps: true });

// Index for leaderboard sorting
streakSchema.index({ currentStreak: -1 });
streakSchema.index({ longestStreak: -1 });

export const Streak = model<IStreak>('Streak', streakSchema);
