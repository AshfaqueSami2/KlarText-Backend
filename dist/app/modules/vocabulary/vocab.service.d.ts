import { IVocab } from './vocab.interface';
export declare const VocabServices: {
    addVocabToDB: (payload: IVocab) => Promise<import("mongoose").UpdateWriteOpResult>;
    getMyVocabFromDB: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, IVocab, {}, import("mongoose").DefaultSchemaOptions> & IVocab & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
};
//# sourceMappingURL=vocab.service.d.ts.map