import { Types } from 'mongoose';
export interface IVocab {
    user: Types.ObjectId;
    lessonId?: Types.ObjectId;
    word: string;
    meaning: string;
    pronunciation?: string;
    whenToReview: Date;
}
//# sourceMappingURL=vocab.interface.d.ts.map