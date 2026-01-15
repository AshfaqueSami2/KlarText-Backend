import { Types } from 'mongoose';

export interface IStreak {
  user: Types.ObjectId;
  currentStreak: number;      // Current consecutive days
  longestStreak: number;      // All-time best streak
  lastActivityDate: Date;     // Last day the user was active
  totalActiveDays: number;    // Total days the user has learned
}

export interface IStreakResponse {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  totalActiveDays: number;
  isActiveToday: boolean;
}
