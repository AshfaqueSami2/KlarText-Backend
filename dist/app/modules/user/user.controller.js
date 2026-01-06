"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const cloudinary_1 = require("../../utils/cloudinary");
const http_status_codes_1 = require("http-status-codes");
const logger_1 = __importDefault(require("../../utils/logger"));
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    let profileImageUrl = '';
    if (req.file) {
        try {
            logger_1.default.debug('File received for upload', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
            const fileName = `student_${Date.now()}_${Math.random().toString(36).substring(7)}`;
            const uploadResult = await (0, cloudinary_1.uploadImageToCloudinary)(req.file.buffer, fileName);
            profileImageUrl = uploadResult.secure_url;
            logger_1.default.info('Profile image uploaded successfully');
        }
        catch (error) {
            logger_1.default.error('Cloudinary upload error', { error });
        }
    }
    else {
        logger_1.default.debug('No file received in request');
    }
    const userData = {
        ...req.body,
        profileImage: profileImageUrl
    };
    logger_1.default.debug('Creating student', { email: userData.email });
    const result = await user_service_1.UserServices.createStudentIntoDB(userData);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Student created successfully",
        data: result,
    });
});
const createAdmin = (0, catchAsync_1.default)(async (req, res) => {
    let profileImageUrl = '';
    if (req.file) {
        const fileName = `admin_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const uploadResult = await (0, cloudinary_1.uploadImageToCloudinary)(req.file.buffer, fileName);
        profileImageUrl = uploadResult.secure_url;
    }
    const userData = {
        ...req.body,
        profileImage: profileImageUrl
    };
    const result = await user_service_1.UserServices.createAdminIntoDB(userData);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Admin created successfully",
        data: result,
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    if (!user?.userId || !user?.role) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const { userId, role } = user;
    const result = await user_service_1.UserServices.getMe(userId, role);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'User profile retrieved successfully',
        data: result,
    });
});
const updateProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    if (!user?.userId || !user?.role) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const { userId, role } = user;
    let profileImageUrl = '';
    if (req.file) {
        const fileName = `profile_${userId}_${Date.now()}`;
        const uploadResult = await (0, cloudinary_1.uploadImageToCloudinary)(req.file.buffer, fileName);
        profileImageUrl = uploadResult.secure_url;
        logger_1.default.info('Profile image updated successfully', { userId });
    }
    const updateData = {
        ...req.body,
        ...(profileImageUrl && { profileImage: profileImageUrl })
    };
    const result = await user_service_1.UserServices.updateProfile(userId, role, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
});
exports.UserControllers = {
    createUser,
    createAdmin,
    getMe,
    updateProfile,
};
//# sourceMappingURL=user.controller.js.map