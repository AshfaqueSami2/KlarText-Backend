import { StatusCodes } from 'http-status-codes';
import AppError from '../../Error/AppError';
import { Lesson } from '../lesson/lesson.model';
import { IVocab } from './vocab.interface';
import { Vocab } from './vocab.model';

const addVocabToDB = async (payload: IVocab) => {
  
  // --- 🔒 SECURITY CHECK START ---
  
  if (payload.lessonId) {
    // 1. Find the Lesson
    const lesson = await Lesson.findById(payload.lessonId);

    // Check 1: Does the lesson exist?
    if (!lesson) {
      throw new AppError(StatusCodes.NOT_FOUND, "The associated lesson does not exist.");
    }

    // Check 2: (Optional/Strict) Is the word actually in the content?
    // We convert both to lowercase to ensure "Apfel" matches "apfel"
    const contentLower = lesson.content.toLowerCase();
    const wordLower = payload.word.toLowerCase();

    if (!contentLower.includes(wordLower)) {
       throw new AppError(StatusCodes.BAD_REQUEST, "This word does not appear in the specified lesson.");
    }
  }
  
  // --- 🔒 SECURITY CHECK END ---

  // Proceed with saving (Upsert)
  const result = await Vocab.updateOne(
    { user: payload.user, word: payload.word }, 
    { 
      $set: payload,
      $setOnInsert: { whenToReview: new Date() } 
    }, 
    { upsert: true }
  );
  
  return result;
};

// 2. Get My Vocabulary
const getMyVocabFromDB = async (userId: string) => {
  const result = await Vocab.find({ user: userId })
    .sort({ createdAt: -1 }) // Show newest words first
    .populate('lessonId', 'title'); // Show which lesson it came from
    
  return result;
};

export const VocabServices = {
  addVocabToDB,
  getMyVocabFromDB,
};