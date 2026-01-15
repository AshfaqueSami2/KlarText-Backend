import { StatusCodes } from 'http-status-codes';
import AppError from '../../Error/AppError';
import { Streak } from './streak.model';
import { IStreakResponse } from './streak.interface';

// Helper: Check if two dates are the same day
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Helper: Check if date1 is exactly one day before date2
const isYesterday = (lastDate: Date, today: Date): boolean => {
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(lastDate, yesterday);
};

// 1. Record Activity (call this when user completes a lesson, saves vocab, etc.)
const recordActivity = async (userId: string): Promise<IStreakResponse> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  let streak = await Streak.findOne({ user: userId });

  // Create new streak record if doesn't exist
  if (!streak) {
    streak = await Streak.create({
      user: userId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: today,
      totalActiveDays: 1,
    });

    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate,
      totalActiveDays: streak.totalActiveDays,
      isActiveToday: true,
    };
  }

  const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;

  // Already active today - no update needed
  if (lastActivity && isSameDay(lastActivity, today)) {
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      lastActivityDate: streak.lastActivityDate,
      totalActiveDays: streak.totalActiveDays,
      isActiveToday: true,
    };
  }

  // Continue streak if last activity was yesterday
  if (lastActivity && isYesterday(lastActivity, today)) {
    streak.currentStreak += 1;
  } else {
    // Streak broken - reset to 1
    streak.currentStreak = 1;
  }

  // Update longest streak if current beats it
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  streak.lastActivityDate = today;
  streak.totalActiveDays += 1;

  await streak.save();

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    lastActivityDate: streak.lastActivityDate,
    totalActiveDays: streak.totalActiveDays,
    isActiveToday: true,
  };
};

// 2. Get User's Streak Stats
const getMyStreak = async (userId: string): Promise<IStreakResponse> => {
  const streak = await Streak.findOne({ user: userId });

  if (!streak) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: new Date(),
      totalActiveDays: 0,
      isActiveToday: false,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
  const isActiveToday = lastActivity ? isSameDay(lastActivity, today) : false;

  // Check if streak is still valid (not broken)
  let currentStreak = streak.currentStreak;
  if (lastActivity && !isActiveToday && !isYesterday(lastActivity, today)) {
    // Streak is broken but not yet updated in DB
    currentStreak = 0;
  }

  return {
    currentStreak,
    longestStreak: streak.longestStreak,
    lastActivityDate: streak.lastActivityDate,
    totalActiveDays: streak.totalActiveDays,
    isActiveToday,
  };
};

// 3. Get Streak Leaderboard (Top 10 by current streak)
const getStreakLeaderboard = async (limit: number = 10) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Only show users with active streaks (active today or yesterday)
  const result = await Streak.find({
    lastActivityDate: { $gte: yesterday },
    currentStreak: { $gt: 0 },
  })
    .sort({ currentStreak: -1, longestStreak: -1 })
    .limit(limit)
    .populate('user', 'name profileImage');

  return result.map((streak, index) => ({
    rank: index + 1,
    user: streak.user,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    totalActiveDays: streak.totalActiveDays,
  }));
};

// 4. Get All-Time Best Streaks Leaderboard
const getLongestStreakLeaderboard = async (limit: number = 10) => {
  const result = await Streak.find({ longestStreak: { $gt: 0 } })
    .sort({ longestStreak: -1, totalActiveDays: -1 })
    .limit(limit)
    .populate('user', 'name profileImage');

  return result.map((streak, index) => ({
    rank: index + 1,
    user: streak.user,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    totalActiveDays: streak.totalActiveDays,
  }));
};

export const StreakServices = {
  recordActivity,
  getMyStreak,
  getStreakLeaderboard,
  getLongestStreakLeaderboard,
};
