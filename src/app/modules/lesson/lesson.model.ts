import { Schema, model } from 'mongoose';
import { ILesson } from './lesson.interface';
import { GERMAN_LEVELS } from '../user/user.constant';

const lessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  
  difficulty: { 
    type: String, 
    enum: GERMAN_LEVELS, 
    required: true 
  },
  
  coverImage: { type: String, default: '' },
  audioUrl: { type: String },
  audioStatus: { 
    type: String, 
    enum: ['pending', 'generating', 'ready', 'error'],
    default: 'pending'
  },
  
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  
  isPublished: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

// ============================================
// 📊 INDEXES FOR QUERY OPTIMIZATION
// ============================================
// Note: slug already indexed via unique: true in schema
lessonSchema.index({ difficulty: 1 }); // Filter by difficulty
lessonSchema.index({ isPublished: 1, isDeleted: 1 }); // Filter published/active lessons
lessonSchema.index({ createdAt: -1 }); // Sort by creation date
lessonSchema.index({ title: 'text', content: 'text' }); // Full-text search

export const Lesson = model<ILesson>('Lesson', lessonSchema);