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
exports.AzureTTSService = void 0;
const sdk = __importStar(require("microsoft-cognitiveservices-speech-sdk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Error/AppError"));
const http_status_codes_1 = require("http-status-codes");
const azureBlobStorage_service_1 = require("../../services/azureBlobStorage.service");
const logger_1 = __importDefault(require("../../utils/logger"));
class AzureTTSService {
    static initializeSpeechConfig() {
        if (!this.speechConfig) {
            if (!config_1.default.azure.speech.key || !config_1.default.azure.speech.region) {
                throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Azure Speech Services configuration is missing');
            }
            this.speechConfig = sdk.SpeechConfig.fromSubscription(config_1.default.azure.speech.key, config_1.default.azure.speech.region);
        }
    }
    static ensureAudioDirectory() {
        const audioDir = path_1.default.join(process.cwd(), 'public', 'audio', 'lessons');
        if (!fs_1.default.existsSync(audioDir)) {
            fs_1.default.mkdirSync(audioDir, { recursive: true });
        }
        return audioDir;
    }
    static async generateAudio(text, options = {}) {
        try {
            this.initializeSpeechConfig();
            const voiceName = options.voiceName || config_1.default.azure.speech.voiceName || 'de-DE-KatjaNeural';
            this.speechConfig.speechSynthesisVoiceName = voiceName;
            const timestamp = Date.now();
            const fileName = `azure_tts_${timestamp}.mp3`;
            this.speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
            const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
            const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);
            const ssml = this.createSSML(text, voiceName, options);
            return new Promise(async (resolve, reject) => {
                synthesizer.speakSsmlAsync(ssml, async (result) => {
                    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                        synthesizer.close();
                        try {
                            const audioBuffer = Buffer.from(result.audioData);
                            const blobUrl = await azureBlobStorage_service_1.azureBlobService.uploadAudioFile(audioBuffer, fileName);
                            const duration = Math.ceil(audioBuffer.length / 16000);
                            resolve({
                                fileName,
                                audioUrl: blobUrl,
                                filePath: blobUrl,
                                duration,
                                mimeType: 'audio/mpeg'
                            });
                        }
                        catch (uploadError) {
                            reject(new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Failed to upload audio to blob storage: ${uploadError}`));
                        }
                    }
                    else {
                        synthesizer.close();
                        reject(new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Speech synthesis failed: ${result.errorDetails}`));
                    }
                }, (error) => {
                    synthesizer.close();
                    reject(new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Speech synthesis error: ${error}`));
                });
            });
        }
        catch (error) {
            throw new AppError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, `Azure TTS Error: ${error}`);
        }
    }
    static async generateLessonAudio(lessonTitle, lessonContent, options = {}) {
        const cleanTitle = this.cleanTextForTTS(lessonTitle);
        const cleanContent = this.cleanTextForTTS(lessonContent);
        const fullText = `${cleanTitle}. ${cleanContent}`;
        logger_1.default.debug(`📝 Lesson Audio - Title: "${cleanTitle}"`);
        logger_1.default.debug(`📄 Content length: ${cleanContent.length} characters`);
        if (fullText.length > 2500) {
            return this.generateChunkedAudio(fullText, options);
        }
        return this.generateAudio(fullText, options);
    }
    static async generateBatchAudio(texts, options = {}) {
        const results = [];
        for (const text of texts) {
            try {
                const result = await this.generateAudio(text, options);
                results.push(result);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            catch (error) {
                logger_1.default.error(`Failed to generate audio for text: ${text.substring(0, 50)}...`, { error });
            }
        }
        return results;
    }
    static async generateChunkedAudio(text, options = {}) {
        const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
        const chunks = [];
        let currentChunk = '';
        for (const sentence of sentences) {
            if ((currentChunk + sentence).length > 2000) {
                if (currentChunk)
                    chunks.push(currentChunk.trim());
                currentChunk = sentence;
            }
            else {
                currentChunk += ' ' + sentence;
            }
        }
        if (currentChunk)
            chunks.push(currentChunk.trim());
        const combinedText = chunks.join(' ');
        return this.generateAudio(combinedText, options);
    }
    static cleanTextForTTS(text) {
        return text
            .replace(/<[^>]*>/g, '')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/__(.*?)__/g, '$1')
            .replace(/_(.*?)_/g, '$1')
            .replace(/`(.*?)`/g, '$1')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/[•◦▪▫–—]/g, '-')
            .replace(/[""'']/g, '"')
            .replace(/[…]/g, '...')
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/[ \t]+/g, ' ')
            .replace(/\n /g, '\n')
            .replace(/ \n/g, '\n')
            .trim();
    }
    static escapeXml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&apos;');
    }
    static createSSML(text, voiceName, options) {
        const speed = options.speed || 1.0;
        const pitch = options.pitch || 0;
        const cleanedText = this.cleanTextForTTS(text);
        const escapedText = this.escapeXml(cleanedText);
        logger_1.default.debug(`🎤 TTS Text Preview (first 100 chars): ${cleanedText.substring(0, 100)}...`);
        return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="de-DE">
        <voice name="${voiceName}">
          <prosody rate="${speed}" pitch="${pitch >= 0 ? '+' : ''}${pitch}Hz">
            <break time="500ms"/>
            ${escapedText}
            <break time="500ms"/>
          </prosody>
        </voice>
      </speak>`.replace(/\s+/g, ' ').trim();
    }
    static getGermanVoices() {
        return [
            { name: 'de-DE-KatjaNeural', gender: 'Female', style: 'Clear, Professional' },
            { name: 'de-DE-ConradNeural', gender: 'Male', style: 'Natural, Warm' },
            { name: 'de-DE-AmalaNeural', gender: 'Female', style: 'Young, Friendly' },
            { name: 'de-DE-BerndNeural', gender: 'Male', style: 'Deep, Authoritative' },
            { name: 'de-DE-ChristelNeural', gender: 'Female', style: 'Mature, Calm' }
        ];
    }
    static getSupportedLanguages() {
        return [
            { code: 'de-DE', name: 'German (Germany)', voices: this.getGermanVoices() },
            { code: 'de-AT', name: 'German (Austria)' },
            { code: 'de-CH', name: 'German (Switzerland)' },
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' }
        ];
    }
}
exports.AzureTTSService = AzureTTSService;
//# sourceMappingURL=tts.service.js.map