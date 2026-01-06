"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTSRoutes = void 0;
const express_1 = require("express");
const tts_controller_1 = require("./tts.controller");
const validateRequest_1 = __importDefault(require("../../middleWares/validateRequest"));
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const generateTextAudioSchema = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string().min(1, 'Text is required'),
        voiceName: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
        speed: zod_1.z.number().min(0.5).max(2).optional(),
        pitch: zod_1.z.number().min(-50).max(50).optional()
    })
});
const generateLessonAudioSchema = zod_1.z.object({
    params: zod_1.z.object({
        lessonId: zod_1.z.string().min(1, 'Lesson ID is required')
    }),
    body: zod_1.z.object({
        voiceName: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
        speed: zod_1.z.number().min(0.5).max(2).optional(),
        pitch: zod_1.z.number().min(-50).max(50).optional()
    }).optional()
});
const generateBatchAudioSchema = zod_1.z.object({
    body: zod_1.z.object({
        texts: zod_1.z.array(zod_1.z.string().min(1)).min(1, 'At least one text is required'),
        voiceName: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
        speed: zod_1.z.number().min(0.5).max(2).optional(),
        pitch: zod_1.z.number().min(-50).max(50).optional()
    })
});
router.post('/generate-text', (0, validateRequest_1.default)(generateTextAudioSchema), tts_controller_1.TTSController.generateTextAudio);
router.post('/generate-lesson/:lessonId', (0, validateRequest_1.default)(generateLessonAudioSchema), tts_controller_1.TTSController.generateLessonAudio);
router.post('/generate-batch', (0, validateRequest_1.default)(generateBatchAudioSchema), tts_controller_1.TTSController.generateBatchAudio);
router.get('/voices', tts_controller_1.TTSController.getVoices);
router.get('/audio/:fileName', tts_controller_1.TTSController.streamAudio);
exports.TTSRoutes = router;
//# sourceMappingURL=tts.route.js.map