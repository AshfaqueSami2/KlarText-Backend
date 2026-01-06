import { Types } from 'mongoose';

export interface IVocab {
  user: Types.ObjectId;     // Who saved it?
  lessonId?: Types.ObjectId; // Where did they find it? (Optional)
  word: string;             // The German word (e.g. "Gehen")
  meaning: string;          // The English translation (e.g. "To Go")
  pronunciation?: string;   // Optional: IPA or Audio link
  whenToReview: Date;       // For Spaced Repetition (SRS)
}