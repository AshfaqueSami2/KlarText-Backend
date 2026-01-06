import { ILesson } from './lesson.interface';
import { Lesson } from './lesson.model';
import { AzureTTSService } from '../textToS/tts.service';
import logger from '../../utils/logger';

// Helper function to generate audio for lesson (Background Worker)
const generateLessonAudioAsync = async (lessonId: string, title: string, content: string) => {
  const startTime = Date.now();
  logger.info(`🎤 Starting audio generation for lesson: ${lessonId}`);
  
  try {
    // Update status to generating
    await Lesson.findByIdAndUpdate(lessonId, { 
      audioStatus: 'generating',
      updatedAt: new Date()
    });
    
    // Validate lesson still exists and is published
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || !lesson.isPublished) {
      logger.warn(`⚠️ Lesson ${lessonId} no longer exists or not published, skipping audio generation`);
      return;
    }
    
    // Generate audio with optimized settings for German learning
    const audioResult = await AzureTTSService.generateLessonAudio(title, content, {
      voiceName: 'de-DE-KatjaNeural', // Clear professional voice
      language: 'de-DE',
      speed: 0.95, // Slightly slower for language learning
      pitch: 0
    });
    
    // Update lesson with audio URL and status
    const updateResult = await Lesson.findByIdAndUpdate(lessonId, {
      audioUrl: audioResult.audioUrl,
      audioStatus: 'ready',
      updatedAt: new Date()
    }, { new: true });
    
    const duration = Date.now() - startTime;
    logger.info(`✅ Audio generated successfully for lesson: ${lessonId} (${duration}ms)`);
    logger.debug(`🔗 Audio URL: ${audioResult.audioUrl}`);
    
    return updateResult;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(`❌ Failed to generate audio for lesson ${lessonId} after ${duration}ms`, { error });
    
    // Update status to error with error details
    await Lesson.findByIdAndUpdate(lessonId, { 
      audioStatus: 'error',
      updatedAt: new Date()
    });
    
    // Log error for monitoring
    logger.error('Audio generation error details', {
      lessonId,
      title: title.substring(0, 50),
      contentLength: content.length,
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// 1. Create a Lesson (Admin only)
const createLessonIntoDB = async (payload: ILesson) => {
  const result = await Lesson.create(payload);
  
  // If lesson is published, enqueue audio generation job
  if (result.isPublished) {
    logger.info(`📝 Lesson created with ID: ${result._id}, enqueueing audio generation...`);
    
    // Set initial status
    await Lesson.findByIdAndUpdate(result._id, { audioStatus: 'pending' });
    
    // Enqueue background job (fire and forget)
    setImmediate(() => {
      generateLessonAudioAsync(
        result._id.toString(),
        result.title,
        result.content
      );
    });
    
    logger.info(`🔄 Audio generation job enqueued for lesson: ${result._id}`);
  }
  
  return result;
};



const getAllLessonsFromDB = async (query: Record<string, unknown>) => {
 
  const queryObj = { ...query };

  // Pagination defaults
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 20, 100); // Max 100 per page
  const skip = (page - 1) * limit;

  const excludeFields = ['sort', 'page', 'limit', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);

  // Build sort option
  const sortBy = (query.sort as string) || '-createdAt';

  const [result, total] = await Promise.all([
    Lesson.find({ 
      ...queryObj, 
      isPublished: true, 
      isDeleted: false 
    })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(), // Use lean() for better performance
    Lesson.countDocuments({
      ...queryObj,
      isPublished: true,
      isDeleted: false
    })
  ]);

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

//update
const updateLessonInDB = async (id: string, payload: Partial<ILesson>) => {
  const existingLesson = await Lesson.findById(id);
  if (!existingLesson) {
    throw new Error('Lesson not found');
  }
  
  const result = await Lesson.findByIdAndUpdate(id, payload, {
    new: true, // Return the updated document
    runValidators: true,
  });
  
  // Check if audio regeneration is needed
  const isNowPublished = payload.isPublished && !existingLesson.isPublished;
  const contentChanged = (payload.title && payload.title !== existingLesson.title) || 
                        (payload.content && payload.content !== existingLesson.content);
  const needsAudio = !result!.audioUrl && result!.isPublished;
  
  // Generate audio if:
  // 1. Lesson is being published for first time, OR
  // 2. Content changed and lesson is published, OR  
  // 3. No audio exists and lesson is published
  if (result && (isNowPublished || (contentChanged && result.isPublished) || needsAudio)) {
    logger.info(`🔄 Audio regeneration triggered for lesson: ${id}`, {
      isNowPublished,
      contentChanged,
      needsAudio
    });
    
    // Reset audio status and clear old URL
    await Lesson.findByIdAndUpdate(id, { 
      audioUrl: null, 
      audioStatus: 'pending',
      updatedAt: new Date()
    });
    
    // Enqueue background audio generation job
    setImmediate(() => {
      generateLessonAudioAsync(
        result._id.toString(),
        result.title,
        result.content
      );
    });
    
    logger.info(`🎤 Audio regeneration job enqueued for lesson: ${id}`);
  }
  
  return result;
};


const deleteLessonFromDB = async (id: string) => {
  const result = await Lesson.findByIdAndUpdate(
    id,
    { isDeleted: true }, // Mark as deleted
    { new: true }
  );
  return result;
};

// Get lesson by ID with audio status
const getLessonByIdFromDB = async (id: string) => {
  const result = await Lesson.findOne({ 
    _id: id, 
    isDeleted: false 
  }).lean();
  return result;
};

// Force regenerate audio for a lesson
const regenerateAudioForLesson = async (id: string) => {
  const lesson = await Lesson.findById(id);
  if (!lesson || !lesson.isPublished) {
    throw new Error('Lesson not found or not published');
  }
  
  // Reset status and regenerate
  await Lesson.findByIdAndUpdate(id, { audioStatus: 'pending' });
  
  setImmediate(() => {
    generateLessonAudioAsync(
      lesson._id.toString(),
      lesson.title,
      lesson.content
    );
  });
  
  return { message: 'Audio regeneration started' };
};

export const LessonServices = {
  createLessonIntoDB,
  getAllLessonsFromDB,
  updateLessonInDB,
  deleteLessonFromDB,
  getLessonByIdFromDB,
  regenerateAudioForLesson
};