"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTSController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
const tts_service_1 = require("./tts.service");
const lesson_model_1 = require("../lesson/lesson.model");
const AppError_1 = __importDefault(require("../../Error/AppError"));
const generateTextAudio = (0, catchAsync_1.default)(async (req, res) => {
    const { text, voiceName, language, speed, pitch } = req.body;
    if (!text) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Text is required');
    }
    const audioResult = await tts_service_1.AzureTTSService.generateAudio(text, {
        voiceName: voiceName || 'de-DE-KatjaNeural',
        language: language || 'de-DE',
        speed: speed || 1.0,
        pitch: pitch || 0
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        audioUrl: audioResult.audioUrl,
        mimeType: audioResult.mimeType
    });
});
const generateLessonAudio = (0, catchAsync_1.default)(async (req, res) => {
    const { lessonId } = req.params;
    const { voiceName, language, speed, pitch } = req.body;
    const lesson = await lesson_model_1.Lesson.findById(lessonId);
    if (!lesson) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Lesson not found');
    }
    const audioResult = await tts_service_1.AzureTTSService.generateLessonAudio(lesson.title, lesson.content, {
        voiceName: voiceName || 'de-DE-KatjaNeural',
        language: language || 'de-DE',
        speed: speed || 1.0,
        pitch: pitch || 0
    });
    lesson.audioUrl = audioResult.audioUrl;
    await lesson.save();
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        audioUrl: audioResult.audioUrl,
        mimeType: audioResult.mimeType
    });
});
const generateBatchAudio = (0, catchAsync_1.default)(async (req, res) => {
    const { texts, voiceName, language, speed, pitch } = req.body;
    if (!texts || !Array.isArray(texts)) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Texts array is required');
    }
    const audioResults = await tts_service_1.AzureTTSService.generateBatchAudio(texts, {
        voiceName: voiceName || 'de-DE-KatjaNeural',
        language: language || 'de-DE',
        speed: speed || 1.0,
        pitch: pitch || 0
    });
    res.status(http_status_codes_1.StatusCodes.OK).json({
        success: true,
        audioUrl: audioResults.length > 0 ? audioResults[0].audioUrl : undefined,
        mimeType: 'audio/mpeg',
        data: audioResults
    });
});
const getVoices = (0, catchAsync_1.default)(async (req, res) => {
    const germanVoices = tts_service_1.AzureTTSService.getGermanVoices();
    const supportedLanguages = tts_service_1.AzureTTSService.getSupportedLanguages();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Available voices retrieved successfully',
        data: {
            germanVoices,
            supportedLanguages
        },
    });
});
const streamAudio = (0, catchAsync_1.default)(async (req, res) => {
    const fileName = req.params.fileName;
    if (!fileName) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'File name is required');
    }
    const { azureBlobService } = await Promise.resolve().then(() => __importStar(require('../../services/azureBlobStorage.service')));
    const audioBuffer = await azureBlobService.downloadAudioFile(fileName);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.end(audioBuffer);
});
exports.TTSController = {
    generateTextAudio,
    generateLessonAudio,
    generateBatchAudio,
    getVoices,
    streamAudio,
};
//# sourceMappingURL=tts.controller.js.map