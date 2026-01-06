import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';
import logger from './logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name as string,
  api_key: config.cloudinary.api_key as string,
  api_secret: config.cloudinary.api_secret as string,
});

// Multer configuration for memory storage
export const uploadProfileImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!') as any, false);
    }
  },
});

// Upload image buffer to Cloudinary
export const uploadImageToCloudinary = async (
  buffer: Buffer, 
  fileName: string,
  folder: string = 'klartext/students'
): Promise<any> => {
  logger.debug('Starting Cloudinary upload', { fileName, bufferSize: buffer.length, folder });
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: folder,
        public_id: fileName,
        transformation: [
          {
            width: 800,
            height: 600,
            crop: 'limit',
            quality: 'auto',
            format: 'auto'
          }
        ],
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error', { error, fileName });
          reject(error);
        } else {
          logger.info('Cloudinary upload success', { url: result?.secure_url });
          resolve(result);
        }
      }
    ).end(buffer);
  });
};

// Upload image from base64 string
export const uploadBase64ToCloudinary = async (
  base64String: string, 
  fileName: string
): Promise<any> => {
  try {
    const result = await cloudinary.uploader.upload(base64String, {
      folder: 'klartext/students',
      public_id: fileName,
      transformation: [
        {
          width: 500,
          height: 500,
          crop: 'limit',
          quality: 'auto',
          format: 'auto'
        }
      ],
      resource_type: 'auto',
    });
    return result;
  } catch (error) {
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.debug('Deleted image from Cloudinary', { publicId });
    return result;
  } catch (error) {
    logger.error('Error deleting image from Cloudinary', { error, publicId });
    throw error;
  }
};

export default cloudinary;