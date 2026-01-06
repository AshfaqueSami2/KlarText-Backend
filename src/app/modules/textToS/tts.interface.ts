export interface TTSRequest {
  text: string;
  voiceName?: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

export interface TTSResponse {
  fileName: string;
  audioUrl: string;
  filePath: string;
  duration?: number;
  mimeType: string;
}

export interface LessonAudioRequest {
  lessonId: string;
  voiceName?: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

export interface LessonAudioResponse {
  lesson: {
    id: string;
    title: string;
    level: string;
  };
  audio: TTSResponse;
}

export interface AzureTTSOptions {
  voiceName?: string;
  language?: string;
  speed?: number;
  pitch?: number;
}

export interface GermanVoice {
  name: string;
  gender: string;
  style: string;
}

export interface SupportedLanguage {
  code: string;
  name: string;
  voices?: GermanVoice[];
}