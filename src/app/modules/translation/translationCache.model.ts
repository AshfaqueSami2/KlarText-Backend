import { Schema, model } from 'mongoose';

const translationSchema = new Schema({
  german: { type: String, required: true, unique: true, lowercase: true }, // Store lowercase to match easily
  english: { type: String, required: true },
});

export const TranslationCache = model('TranslationCache', translationSchema);