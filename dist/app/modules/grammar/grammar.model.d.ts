import { Types } from 'mongoose';
import { IGrammarTopic, IGrammarLesson, IGrammarExerciseSet, IGrammarLessonProgress, IGrammarExerciseProgress, IGrammarTopicMastery } from './grammar.interface';
export declare const GrammarTopic: import("mongoose").Model<IGrammarTopic, {}, {}, {}, import("mongoose").Document<unknown, {}, IGrammarTopic, {}, import("mongoose").DefaultSchemaOptions> & IGrammarTopic & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any, IGrammarTopic>;
export declare const GrammarLesson: import("mongoose").Model<IGrammarLesson, {}, {}, {}, import("mongoose").Document<unknown, {}, IGrammarLesson, {}, import("mongoose").DefaultSchemaOptions> & IGrammarLesson & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any, IGrammarLesson>;
export declare const GrammarExerciseSet: import("mongoose").Model<IGrammarExerciseSet, {}, {}, {}, import("mongoose").Document<unknown, {}, IGrammarExerciseSet, {}, import("mongoose").DefaultSchemaOptions> & IGrammarExerciseSet & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any, IGrammarExerciseSet>;
export declare const GrammarLessonProgress: import("mongoose").Model<IGrammarLessonProgress, {}, {}, {}, import("mongoose").Document<unknown, {}, IGrammarLessonProgress, {}, import("mongoose").DefaultSchemaOptions> & IGrammarLessonProgress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any, IGrammarLessonProgress>;
export declare const GrammarExerciseProgress: import("mongoose").Model<IGrammarExerciseProgress, {}, {}, {}, import("mongoose").Document<unknown, {}, IGrammarExerciseProgress, {}, import("mongoose").DefaultSchemaOptions> & IGrammarExerciseProgress & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any, IGrammarExerciseProgress>;
export declare const GrammarTopicMastery: import("mongoose").Model<IGrammarTopicMastery, {}, {}, {}, import("mongoose").Document<unknown, {}, IGrammarTopicMastery, {}, import("mongoose").DefaultSchemaOptions> & IGrammarTopicMastery & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any, IGrammarTopicMastery>;
//# sourceMappingURL=grammar.model.d.ts.map