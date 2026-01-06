"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationControllers = void 0;
const translation_service_1 = require("./translation.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const translate = async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ success: false, message: "Text is required" });
    }
    const translation = await translation_service_1.TranslationServices.translateText(text);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Translation successful',
        data: {
            translation,
        },
    });
};
exports.TranslationControllers = {
    translate,
};
//# sourceMappingURL=translation.controller.js.map