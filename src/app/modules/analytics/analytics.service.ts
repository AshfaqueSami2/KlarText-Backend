import { Student } from "../student/student.model";
import { Vocab } from "../vocabulary/vocab.model";
import { LessonProgress } from "../lessonProgress/lessonProgress.model";
import { User } from "../user/user.model";
import { Lesson } from "../lesson/lesson.model";

// 1. Get Personal Dashboard Stats
const getStudentAnalytics = async (userId: string) => {
  // A. Count Total Words Saved
  const totalWords = await Vocab.countDocuments({ user: userId });

  const completedLessons = await LessonProgress.countDocuments({
    user: userId,
    isCompleted: true,
  });

  const studentProfile = await Student.findOne({ user: userId });

  return {
    totalWords,
    completedLessons,
    coins: studentProfile?.coins || 0,
    currentLevel: studentProfile?.currentLevel || null,
  };
};

// 2. Get Global Leaderboard (Top 10)
const getLeaderboard = async () => {
  const result = await Student.find()
    .sort({ coins: -1 })
    .limit(10)
    .populate("user", "name profileImage")
    .select("coins currentLevel user");

  return result;
};

// 3. Get Admin System Stats
const getAdminStats = async () => {
  // A. Total Students
  const totalStudents = await User.countDocuments({ role: "student" });

  // B. Total Lessons Created
  const totalLessons = await Lesson.countDocuments();

  // C. Total Published Lessons
  const publishedLessons = await Lesson.countDocuments({ isPublished: true });

  return {
    totalStudents,
    totalLessons,
    publishedLessons,
    // You could add 'totalRevenue' here later if you add payments
  };
};

// 4. Get All Lessons for Admin (Including unpublished and deleted)
const getAllLessonsForAdmin = async (query: Record<string, unknown>) => {
  const queryObj = { ...query };

  const excludeFields = ["sort", "page", "limit", "fields"];
  excludeFields.forEach((el) => delete queryObj[el]);

  // Admin can see ALL lessons - no filtering by isPublished or isDeleted
  const result = await Lesson.find(queryObj).sort({ createdAt: -1 }); // Sort by newest first for admin view

  return result;
};

export const AnalyticsServices = {
  getStudentAnalytics,
  getLeaderboard,
  getAdminStats,
  getAllLessonsForAdmin,
};
