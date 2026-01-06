"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromCloudinary = exports.uploadBase64ToCloudinary = exports.uploadImageToCloudinary = exports.uploadProfileImage = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const multer_1 = __importDefault(require("multer"));
const logger_1 = __importDefault(require("./logger"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloud_name,
    api_key: config_1.default.cloudinary.api_key,
    api_secret: config_1.default.cloudinary.api_secret,
});
exports.uploadProfileImage = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
});
const uploadImageToCloudinary = async (buffer, fileName, folder = 'klartext/students') => {
    logger_1.default.debug('Starting Cloudinary upload', { fileName, bufferSize: buffer.length, folder });
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload_stream({
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
        }, (error, result) => {
            if (error) {
                logger_1.default.error('Cloudinary upload error', { error, fileName });
                reject(error);
            }
            else {
                logger_1.default.info('Cloudinary upload success', { url: result?.secure_url });
                resolve(result);
            }
        }).end(buffer);
    });
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;
const uploadBase64ToCloudinary = async (base64String, fileName) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(base64String, {
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
    }
    catch (error) {
        throw error;
    }
};
exports.uploadBase64ToCloudinary = uploadBase64ToCloudinary;
const deleteImageFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary_1.v2.uploader.destroy(publicId);
        logger_1.default.debug('Deleted image from Cloudinary', { publicId });
        return result;
    }
    catch (error) {
        logger_1.default.error('Error deleting image from Cloudinary', { error, publicId });
        throw error;
    }
};
exports.deleteImageFromCloudinary = deleteImageFromCloudinary;
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map