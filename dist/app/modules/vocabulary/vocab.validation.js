"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabValidation = void 0;
const zod_1 = require("zod");
const addVocabSchema = zod_1.z.object({
    body: zod_1.z.object({
        word: zod_1.z.string().min(1),
        meaning: zod_1.z.string().min(1),
        lessonId: zod_1.z.string().optional(),
    }),
});
exports.VocabValidation = { addVocabSchema };
//# sourceMappingURL=vocab.validation.js.map