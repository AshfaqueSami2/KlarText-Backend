import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { AzureTTSService } from './tts.service';
import { Lesson } from '../lesson/lesson.model';
import AppError from '../../Error/AppError';

const generateTextAudio = catchAsync(async (req: Request, res: Response) => {
  const { text, voiceName, language, speed, pitch } = req.body;

  if (!text) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Text is required');
  }

  const audioResult = await AzureTTSService.generateAudio(text, {
    voiceName: voiceName || 'de-DE-KatjaNeural',
    language: language || 'de-DE',
    speed: speed || 1.0,
    pitch: pitch || 0
  });

  // Return simple format with audioUrl at top level
  res.status(StatusCodes.OK).json({
    success: true,
    audioUrl: audioResult.audioUrl,
    mimeType: audioResult.mimeType
  });
});

const generateLessonAudio = catchAsync(async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const { voiceName, language, speed, pitch } = req.body;

  // Find the lesson
  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Lesson not found');
  }

  // Generate audio for the full lesson
  const audioResult = await AzureTTSService.generateLessonAudio(
    lesson.title,
    lesson.content,
    {
      voiceName: voiceName || 'de-DE-KatjaNeural',
      language: language || 'de-DE',
      speed: speed || 1.0,
      pitch: pitch || 0
    }
  );

  // Update lesson with audio URL (optional - save for caching)
  lesson.audioUrl = audioResult.audioUrl;
  await lesson.save();

  // Return simple format with audioUrl at top level
  res.status(StatusCodes.OK).json({
    success: true,
    audioUrl: audioResult.audioUrl,
    mimeType: audioResult.mimeType
  });
});

const generateBatchAudio = catchAsync(async (req: Request, res: Response) => {
  const { texts, voiceName, language, speed, pitch } = req.body;

  if (!texts || !Array.isArray(texts)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Texts array is required');
  }

  const audioResults = await AzureTTSService.generateBatchAudio(texts, {
    voiceName: voiceName || 'de-DE-KatjaNeural',
    language: language || 'de-DE',
    speed: speed || 1.0,
    pitch: pitch || 0
  });

  // Return batch results with first audio URL at top level
  res.status(StatusCodes.OK).json({
    success: true,
    audioUrl: audioResults.length > 0 ? audioResults[0].audioUrl : undefined,
    mimeType: 'audio/mpeg',
    data: audioResults
  });
});

const getVoices = catchAsync(async (req: Request, res: Response) => {
  const germanVoices = AzureTTSService.getGermanVoices();
  const supportedLanguages = AzureTTSService.getSupportedLanguages();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Available voices retrieved successfully',
    data: {
      germanVoices,
      supportedLanguages
    },
  });
});

const streamAudio = catchAsync(async (req: Request, res: Response) => {
  const fileName = req.params.fileName as string;

  if (!fileName) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'File name is required');
  }

  // Import azure blob service
  const { azureBlobService } = await import('../../services/azureBlobStorage.service');
  
  // Download audio file from blob storage
  const audioBuffer = await azureBlobService.downloadAudioFile(fileName);
  
  // Set appropriate headers for MP3 audio streaming
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Length', audioBuffer.length);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
  
  // Stream the audio buffer to client
  res.end(audioBuffer);
});

export const TTSController = {
  generateTextAudio,
  generateLessonAudio,
  generateBatchAudio,
  getVoices,
  streamAudio,
};