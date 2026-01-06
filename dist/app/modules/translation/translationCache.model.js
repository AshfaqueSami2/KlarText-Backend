"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationCache = void 0;
const mongoose_1 = require("mongoose");
const translationSchema = new mongoose_1.Schema({
    german: { type: String, required: true, unique: true, lowercase: true },
    english: { type: String, required: true },
});
exports.TranslationCache = (0, mongoose_1.model)('TranslationCache', translationSchema);
//# sourceMappingURL=translationCache.model.js.map