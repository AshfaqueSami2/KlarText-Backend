import { Schema, model } from 'mongoose';
import { IVocab } from './vocab.interface';


const vocabSchema = new Schema<IVocab>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
  word: { type: String, required: true, trim: true },
  meaning: { type: String, required: true },
  pronunciation: { type: String },
  whenToReview: { type: Date, default: Date.now }, // Default: Review immediately
}, { timestamps: true });

// 🛑 OPTIMIZATION: Prevent duplicates
// A user cannot have the word "Apfel" twice in their list.
vocabSchema.index({ user: 1, word: 1 }, { unique: true });

export const Vocab = model<IVocab>('Vocab', vocabSchema);