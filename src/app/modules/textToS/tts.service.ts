import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import fs from 'fs';
import path from 'path';
import config from '../../config';
import AppError from '../../Error/AppError';
import { HttpStatus } from 'http-status-ts';
import { azureBlobService } from '../../services/azureBlobStorage.service';
import logger from '../../utils/logger';
import {
  AzureTTSOptions,
  TTSResponse,
  GermanVoice,
  SupportedLanguage
} from './tts.interface';

export class AzureTTSService {
  private static speechConfig: sdk.SpeechConfig;

  private static initializeSpeechConfig() {
    if (!this.speechConfig) {
      if (!config.azure.speech.key || !config.azure.speech.region) {
        throw new AppError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Azure Speech Services configuration is missing'
        );
      }
      
      this.speechConfig = sdk.SpeechConfig.fromSubscription(
        config.azure.speech.key,
        config.azure.speech.region
      );
    }
  }

  private static ensureAudioDirectory(): string {
    const audioDir = path.join(process.cwd(), 'public', 'audio', 'lessons');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    return audioDir;
  }

  static async generateAudio(
    text: string,
    options: AzureTTSOptions = {}
  ): Promise<TTSResponse> {
    try {
      this.initializeSpeechConfig();

      // German voice for language learning
      const voiceName = options.voiceName || config.azure.speech.voiceName || 'de-DE-KatjaNeural';
      this.speechConfig.speechSynthesisVoiceName = voiceName;

      // Generate unique filename with MP3 extension
      const timestamp = Date.now();
      const fileName = `azure_tts_${timestamp}.mp3`;

      // Configure speech config for MP3 output
      this.speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
      
      // Configure audio output (we'll capture the result buffer)
      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
      
      // Create synthesizer
      const synthesizer = new sdk.SpeechSynthesizer(this.speechConfig, audioConfig);

      // Generate SSML for better control
      const ssml = this.createSSML(text, voiceName, options);

      return new Promise(async (resolve, reject) => {
        synthesizer.speakSsmlAsync(
          ssml,
          async (result) => {
            if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
              synthesizer.close();
              
              try {
                // Get audio data as buffer
                const audioBuffer = Buffer.from(result.audioData);
                
                // Upload to Azure Blob Storage
                const blobUrl = await azureBlobService.uploadAudioFile(audioBuffer, fileName);
                
                // Calculate approximate duration for MP3 (different calculation than WAV)
                const duration = Math.ceil(audioBuffer.length / 16000); // MP3 has different bitrate

                resolve({
                  fileName,
                  audioUrl: blobUrl, // Now returns Azure Blob URL
                  filePath: blobUrl, // For backward compatibility
                  duration,
                  mimeType: 'audio/mpeg'
                });
              } catch (uploadError) {
                reject(new AppError(
                  HttpStatus.INTERNAL_SERVER_ERROR,
                  `Failed to upload audio to blob storage: ${uploadError}`
                ));
              }
            } else {
              synthesizer.close();
              reject(new AppError(
                HttpStatus.BAD_REQUEST,
                `Speech synthesis failed: ${result.errorDetails}`
              ));
            }
          },
          (error) => {
            synthesizer.close();
            reject(new AppError(
              HttpStatus.INTERNAL_SERVER_ERROR,
              `Speech synthesis error: ${error}`
            ));
          }
        );
      });
    } catch (error) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Azure TTS Error: ${error}`
      );
    }
  }

  static async generateLessonAudio(
    lessonTitle: string,
    lessonContent: string,
    options: AzureTTSOptions = {}
  ): Promise<TTSResponse> {
    // Clean title and content separately
    const cleanTitle = this.cleanTextForTTS(lessonTitle);
    const cleanContent = this.cleanTextForTTS(lessonContent);
    
    // Combine with clear separation
    const fullText = `${cleanTitle}. ${cleanContent}`;
    
    logger.debug(`📝 Lesson Audio - Title: "${cleanTitle}"`);
    logger.debug(`📄 Content length: ${cleanContent.length} characters`);
    
    // For long lessons, chunk them
    if (fullText.length > 2500) { // Reduced threshold for better quality
      return this.generateChunkedAudio(fullText, options);
    }
    
    return this.generateAudio(fullText, options);
  }

  static async generateBatchAudio(
    texts: string[],
    options: AzureTTSOptions = {}
  ): Promise<TTSResponse[]> {
    const results: TTSResponse[] = [];
    
    for (const text of texts) {
      try {
        const result = await this.generateAudio(text, options);
        results.push(result);
        
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logger.error(`Failed to generate audio for text: ${text.substring(0, 50)}...`, { error });
        // Continue with other texts
      }
    }
    
    return results;
  }

  private static async generateChunkedAudio(
    text: string,
    options: AzureTTSOptions = {}
  ): Promise<TTSResponse> {
    // Split long text into sentences for better pronunciation
    const sentences = text.match(/[^\.!?]+[\.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > 2000) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk.trim());

    // For now, use the first chunk or combine them
    const combinedText = chunks.join(' ');
    return this.generateAudio(combinedText, options);
  }

  private static cleanTextForTTS(text: string): string {
    return text
      // Remove any HTML/XML tags
      .replace(/<[^>]*>/g, '')
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/__(.*?)__/g, '$1')     // Bold underscore
      .replace(/_(.*?)_/g, '$1')       // Italic underscore
      .replace(/`(.*?)`/g, '$1')       // Code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      // Remove special characters that might confuse TTS
      .replace(/[•◦▪▫–—]/g, '-')       // Replace bullets with dash
      .replace(/[""'']/g, '"')         // Normalize quotes
      .replace(/[…]/g, '...')          // Replace ellipsis
      // Normalize whitespace and line breaks
      .replace(/\r\n/g, '\n')          // Windows line endings
      .replace(/\r/g, '\n')            // Mac line endings
      .replace(/\n{3,}/g, '\n\n')      // Max 2 consecutive newlines
      .replace(/[ \t]+/g, ' ')         // Multiple spaces/tabs to single space
      .replace(/\n /g, '\n')           // Remove spaces after newlines
      .replace(/ \n/g, '\n')           // Remove spaces before newlines
      .trim();
  }

  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private static createSSML(
    text: string,
    voiceName: string,
    options: AzureTTSOptions
  ): string {
    const speed = options.speed || 1.0;
    const pitch = options.pitch || 0;
    
    // Clean and prepare text for TTS
    const cleanedText = this.cleanTextForTTS(text);
    const escapedText = this.escapeXml(cleanedText);
    
    // Log what will be synthesized for debugging
    logger.debug(`🎤 TTS Text Preview (first 100 chars): ${cleanedText.substring(0, 100)}...`);
    
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

  // German language learning optimized voices
  static getGermanVoices(): GermanVoice[] {
    return [
      { name: 'de-DE-KatjaNeural', gender: 'Female', style: 'Clear, Professional' },
      { name: 'de-DE-ConradNeural', gender: 'Male', style: 'Natural, Warm' },
      { name: 'de-DE-AmalaNeural', gender: 'Female', style: 'Young, Friendly' },
      { name: 'de-DE-BerndNeural', gender: 'Male', style: 'Deep, Authoritative' },
      { name: 'de-DE-ChristelNeural', gender: 'Female', style: 'Mature, Calm' }
    ];
  }

  static getSupportedLanguages(): SupportedLanguage[] {
    return [
      { code: 'de-DE', name: 'German (Germany)', voices: this.getGermanVoices() },
      { code: 'de-AT', name: 'German (Austria)' },
      { code: 'de-CH', name: 'German (Switzerland)' },
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' }
    ];
  }
}