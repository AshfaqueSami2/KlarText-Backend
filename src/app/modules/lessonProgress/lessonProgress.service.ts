import mongoose from 'mongoose';
import { LessonProgress } from './lessonProgress.model';
import { Student } from '../student/student.model';
import { Lesson } from '../lesson/lesson.model';
import { StreakServices } from '../streak/streak.service';
import logger from '../../utils/logger';

// 1. Define the Hierarchy (A1 is lowest, C2 is highest)
const LEVEL_HIERARCHY: Record<string, number> = {
  'A1': 1,
  'A2': 2,
  'B1': 3,
  'B2': 4,
  'C1': 5,
  'C2': 6
};

// Define premium levels
const PREMIUM_LEVELS = ['B1', 'B2', 'C1', 'C2'];

const markLessonAsComplete = async (userId: string, lessonId: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Fetch the Student Profile
    const student = await Student.findOne({ user: userId });
    if (!student) {
      throw new Error('Student profile not found');
    }

    // Handle case where student hasn't selected level yet
    if (!student.currentLevel) {
      throw new Error('Please select your German level first before completing lessons');
    }

    // 2. Fetch the Lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // 3. CHECK SUBSCRIPTION STATUS
    const isPremium = student.subscriptionStatus === 'premium';
    const isLifetime = student.subscriptionPlan === 'lifetime';
    const isNotExpired = !student.subscriptionExpiry || new Date() < student.subscriptionExpiry;
    const hasActivePremium = isPremium && (isLifetime || isNotExpired);

    // 4. CHECK SUBSCRIPTION FOR PREMIUM LEVELS (B1, B2, C1, C2)
    if (PREMIUM_LEVELS.includes(lesson.difficulty)) {
      if (!hasActivePremium) {
        throw new Error(
          `⭐ Premium Required: ${lesson.difficulty} lessons require a premium subscription. Upgrade to Monthly (৳399), Yearly (৳3,999), or Lifetime (৳7,999) to access B1-C2 lessons!`
        );
      }
    }

    // 5. THE VALIDATION GATE (Progressive Unlock Logic)
    // Premium users can access ANY level without restrictions
    if (!hasActivePremium) {
      const studentRank = LEVEL_HIERARCHY[student.currentLevel] || 0;
      const lessonRank = LEVEL_HIERARCHY[lesson.difficulty] || 0;

      // Logic: If Student Rank is LOWER than Lesson Rank -> BLOCK (only for free users)
      if (studentRank < lessonRank) {
        throw new Error(
          `Access Denied: This lesson is Level ${lesson.difficulty}. You are currently Level ${student.currentLevel}. Complete all ${student.currentLevel} lessons to unlock this level.`
        );
      }
    }

    // 5. Check if already completed
    const existingProgress = await LessonProgress.findOne({ user: userId, lesson: lessonId });
    if (existingProgress) {
      throw new Error('You have already completed this lesson');
    }

    // 5. Create Progress Record
    logger.debug(`[markLessonAsComplete] Creating progress record for user: ${userId}, lesson: ${lessonId}`);
    const createdProgress = await LessonProgress.create([{ user: userId, lesson: lessonId, isCompleted: true }], { session });
    logger.debug(`[markLessonAsComplete] Progress record created:`, { progressId: createdProgress[0]?._id, user: createdProgress[0]?.user, lesson: createdProgress[0]?.lesson });

    // 6. Add Coins (+10)
    const updatedStudent = await Student.findOneAndUpdate(
      { user: userId }, 
      { $inc: { coins: 10 } }, 
      { new: true, session }
    );

    // 7. 🚀 CHECK FOR LEVEL PROMOTION (include current lesson)
    const levelPromotion = await checkAndPromoteLevel(userId, student.currentLevel, lessonId, session);

    await session.commitTransaction();
    logger.debug(`[markLessonAsComplete] Transaction committed successfully for user: ${userId}, lesson: ${lessonId}`);
    await session.endSession();

    // 🔥 Record streak activity (outside transaction - non-critical)
    let streakInfo = null;
    try {
      streakInfo = await StreakServices.recordActivity(userId);
      logger.debug(`[markLessonAsComplete] Streak updated: ${streakInfo.currentStreak} days`);
    } catch (streakError) {
      logger.warn(`[markLessonAsComplete] Failed to update streak:`, streakError);
    }

    return { 
      message: "Lesson Completed", 
      awardedCoins: 10,
      newBalance: updatedStudent!.coins,
      streak: streakInfo,
      ...levelPromotion // Include promotion info if any
    };

  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

// 🌟 NEW: Auto Level Progression Logic
const checkAndPromoteLevel = async (userId: string, currentLevel: string, currentLessonId: string, session: any) => {
  // Get all lesson IDs for current level
  const lessonsInCurrentLevel = await Lesson.find({ 
    difficulty: currentLevel, 
    isPublished: true, 
    isDeleted: false 
  }).select('_id');

  const totalLessonsInLevel = lessonsInCurrentLevel.length;

  // Get completed lessons for current level by this user (within the same session)
  // We need to use the session to see the just-completed lesson
  const completedLessons = await LessonProgress.find({
    user: userId,
    isCompleted: true,
    lesson: { 
      $in: lessonsInCurrentLevel.map(lesson => lesson._id)
    }
  }).session(session);

  const completedLessonsInLevel = completedLessons.length;

  logger.debug(`Level ${currentLevel}: ${completedLessonsInLevel}/${totalLessonsInLevel} completed`);
  logger.debug(`Lesson IDs in ${currentLevel}:`, { lessonIds: lessonsInCurrentLevel.map(l => l._id) });
  logger.debug(`Completed lesson IDs:`, { completedIds: completedLessons.map(p => p.lesson) });
  logger.debug(`Current lesson being completed:`, { currentLessonId });

  // Check if all lessons in current level are completed
  if (completedLessonsInLevel >= totalLessonsInLevel && totalLessonsInLevel > 0) {
    // Get next level
    const currentRank = LEVEL_HIERARCHY[currentLevel];
    const nextLevel = Object.keys(LEVEL_HIERARCHY).find(level => 
      LEVEL_HIERARCHY[level] === currentRank + 1
    );

    if (nextLevel) {
      logger.info(`Promoting user ${userId} from ${currentLevel} to ${nextLevel}`);
      
      // Promote to next level
      await Student.findOneAndUpdate(
        { user: userId },
        { 
          currentLevel: nextLevel,
          $inc: { coins: 50 } // Bonus coins for level promotion!
        },
        { new: true, session }
      );

      return {
        levelPromoted: true,
        oldLevel: currentLevel,
        newLevel: nextLevel,
        promotionBonus: 50,
        promotionMessage: `🎉 Congratulations! You've been promoted to ${nextLevel} level! +50 bonus coins!`
      };
    } else {
      logger.debug(`No next level found after ${currentLevel}`);
    }
  }

  return {
    levelPromoted: false,
    progress: `${completedLessonsInLevel}/${totalLessonsInLevel} lessons completed in ${currentLevel} level`
  };
};

const reviewCompletedLesson = async (userId: string, lessonId: string) => {
  // 1. Check if user has completed this lesson
  const progress = await LessonProgress.findOne({ 
    user: userId, 
    lesson: lessonId, 
    isCompleted: true 
  });

  if (!progress) {
    throw new Error('You must complete this lesson first before reviewing it');
  }

  // 2. Get lesson content for review
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new Error('Lesson not found');
  }

  // 3. Return lesson with completion info (no coins awarded)
  return {
    lesson,
    completedAt: progress.completedAt,
    message: 'Reviewing completed lesson - no additional coins awarded'
  };
};

const getStudentProgress = async (userId: string) => {
  logger.debug(`[getStudentProgress] Fetching progress for user: ${userId}`);
  
  // Get student's current level
  const student = await Student.findOne({ user: userId });
  
  if (!student) {
    logger.debug(`[getStudentProgress] No student profile found for user: ${userId}`);
    return {
      totalCompleted: 0,
      totalInCurrentLevel: 0,
      progressPercentage: 0,
      currentLevel: null,
      completedLessons: []
    };
  }

  logger.debug(`[getStudentProgress] Student found with currentLevel: ${student.currentLevel}`);

  // Get ALL completed lessons for this user (not just current level)
  const allCompletedProgress = await LessonProgress.find({
    user: userId,
    isCompleted: true
  })
  .populate('lesson', 'title slug difficulty')
  .sort({ completedAt: -1 });

  logger.debug(`[getStudentProgress] Total completed lessons found: ${allCompletedProgress.length}`);

  // If student hasn't selected a level yet, still return their completed lessons
  if (!student.currentLevel) {
    logger.debug(`[getStudentProgress] Student has no currentLevel set`);
    return {
      totalCompleted: allCompletedProgress.length,
      totalInCurrentLevel: 0,
      progressPercentage: 0,
      currentLevel: null,
      completedLessons: allCompletedProgress.map(progress => ({
        lesson: progress.lesson,
        completedAt: progress.completedAt,
        canReview: true
      }))
    };
  }

  // Get all lessons in the student's CURRENT level for progress percentage calculation
  const lessonsInCurrentLevel = await Lesson.find({
    difficulty: student.currentLevel,
    isPublished: true,
    isDeleted: false
  });

  const totalInCurrentLevel = lessonsInCurrentLevel.length;
  const currentLevelLessonIds = lessonsInCurrentLevel.map(l => l._id.toString());

  // Count completed lessons in the current level
  const completedInCurrentLevelCount = allCompletedProgress.filter(
    progress => progress.lesson && currentLevelLessonIds.includes((progress.lesson as any)._id?.toString())
  ).length;

  const progressPercentage = totalInCurrentLevel > 0 
    ? Math.round((completedInCurrentLevelCount / totalInCurrentLevel) * 100) 
    : 0;

  logger.debug(`[getStudentProgress] Current level progress: ${completedInCurrentLevelCount}/${totalInCurrentLevel} (${progressPercentage}%)`);
  logger.debug(`[getStudentProgress] Returning ${allCompletedProgress.length} completed lessons`);
  
  return {
    totalCompleted: allCompletedProgress.length,
    totalInCurrentLevel,
    completedInCurrentLevel: completedInCurrentLevelCount,
    progressPercentage,
    currentLevel: student.currentLevel,
    completedLessons: allCompletedProgress.map(progress => ({
      lesson: progress.lesson,
      completedAt: progress.completedAt,
      canReview: true
    }))
  };
};

const getAvailableLessons = async (userId: string) => {
  // 1. Get student's current level
  const student = await Student.findOne({ user: userId });
  if (!student) {
    throw new Error('Student profile not found');
  }

  if (!student.currentLevel) {
    return {
      message: 'Please select your German level first',
      availableLessons: [],
      needsLevelSelection: true,
      subscriptionStatus: student.subscriptionStatus
    };
  }

  // 2. Check subscription status
  const isPremium = student.subscriptionStatus === 'premium';
  const isLifetime = student.subscriptionPlan === 'lifetime';
  const isNotExpired = !student.subscriptionExpiry || new Date() < student.subscriptionExpiry;
  const hasActiveSubscription = isPremium && (isLifetime || isNotExpired);

  // 3. Get student's current level rank
  const studentRank = LEVEL_HIERARCHY[student.currentLevel] || 0;

  // 4. Get all lessons up to and including student's level
  const availableLevels = Object.keys(LEVEL_HIERARCHY).filter(level => 
    LEVEL_HIERARCHY[level] <= studentRank
  );

  // 5. Get lessons for available levels
  const lessons = await Lesson.find({
    difficulty: { $in: availableLevels },
    isPublished: true,
    isDeleted: false
  }).sort({ difficulty: 1, createdAt: 1 });

  // 6. Get completed lessons to mark them
  const completedLessons = await LessonProgress.find({
    user: userId,
    isCompleted: true
  }).distinct('lesson');

  // 7. Format response with premium status
  const formattedLessons = lessons.map(lesson => {
    const isPremiumLesson = PREMIUM_LEVELS.includes(lesson.difficulty);
    const canAccess = !isPremiumLesson || hasActiveSubscription;
    
    return {
      ...lesson.toObject(),
      isCompleted: completedLessons.some(id => id.equals(lesson._id)),
      isPremium: isPremiumLesson,
      canAccess: canAccess,
      requiresUpgrade: isPremiumLesson && !hasActiveSubscription,
      lockReason: isPremiumLesson && !hasActiveSubscription ? 'Premium subscription required' : null
    };
  });

  return {
    currentLevel: student.currentLevel,
    subscriptionStatus: student.subscriptionStatus,
    subscriptionPlan: student.subscriptionPlan,
    isPremium: hasActiveSubscription,
    availableLessons: formattedLessons,
    totalAvailable: formattedLessons.length,
    completed: completedLessons.length,
    freeLessons: formattedLessons.filter(l => !l.isPremium).length,
    premiumLessons: formattedLessons.filter(l => l.isPremium).length,
    lockedLessons: formattedLessons.filter(l => l.requiresUpgrade).length
  };
};

export const LessonProgressServices = {
  markLessonAsComplete,
  reviewCompletedLesson,
  getStudentProgress,
  getAvailableLessons,
};