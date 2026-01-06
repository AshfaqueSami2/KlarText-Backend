import { Types } from 'mongoose';
import { GERMAN_LEVELS } from '../../modules/user/user.constant';

export type TLessonDifficulty = (typeof GERMAN_LEVELS)[number];

export interface ILesson {
  title: string;
  slug: string;
  content: string;
  difficulty: TLessonDifficulty; 
  coverImage?: string;
  audioUrl?: string;
  audioStatus?: 'pending' | 'generating' | 'ready' | 'error';
  isPublished: boolean;
  isDeleted: boolean;
  admin: Types.ObjectId; // Admin who created this lesson
}