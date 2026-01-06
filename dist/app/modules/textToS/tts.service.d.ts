import { AzureTTSOptions, TTSResponse, GermanVoice, SupportedLanguage } from './tts.interface';
export declare class AzureTTSService {
    private static speechConfig;
    private static initializeSpeechConfig;
    private static ensureAudioDirectory;
    static generateAudio(text: string, options?: AzureTTSOptions): Promise<TTSResponse>;
    static generateLessonAudio(lessonTitle: string, lessonContent: string, options?: AzureTTSOptions): Promise<TTSResponse>;
    static generateBatchAudio(texts: string[], options?: AzureTTSOptions): Promise<TTSResponse[]>;
    private static generateChunkedAudio;
    private static cleanTextForTTS;
    private static escapeXml;
    private static createSSML;
    static getGermanVoices(): GermanVoice[];
    static getSupportedLanguages(): SupportedLanguage[];
}
//# sourceMappingURL=tts.service.d.ts.map