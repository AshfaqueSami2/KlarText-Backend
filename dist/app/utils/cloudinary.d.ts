import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
export declare const uploadProfileImage: multer.Multer;
export declare const uploadImageToCloudinary: (buffer: Buffer, fileName: string, folder?: string) => Promise<any>;
export declare const uploadBase64ToCloudinary: (base64String: string, fileName: string) => Promise<any>;
export declare const deleteImageFromCloudinary: (publicId: string) => Promise<any>;
export default cloudinary;
//# sourceMappingURL=cloudinary.d.ts.map