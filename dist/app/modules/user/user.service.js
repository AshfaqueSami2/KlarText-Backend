"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("./user.model");
const admin_model_1 = require("../admin/admin.model");
const student_model_1 = require("../student/student.model");
const user_constant_1 = require("./user.constant");
const user_utils_1 = require("./user.utils");
const createStudentIntoDB = async (payload) => {
    const userData = {};
    if (payload.googleId) {
        userData.googleId = payload.googleId;
        userData.needsPasswordChange = false;
    }
    else {
        userData.password = payload.password || config_1.default.default_pass;
    }
    userData.role = user_constant_1.USER_ROLE.STUDENT;
    userData.email = payload.email;
    userData.name = payload.name;
    const existingStudentByEmail = await student_model_1.Student.findOne({
        email: payload.email,
    }).lean();
    if (existingStudentByEmail) {
        throw new Error(`Student with email ${payload.email} already exists`);
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        userData.id = await (0, user_utils_1.generateStudentId)();
        const [createdUser] = await user_model_1.User.create([userData], { session });
        if (!createdUser) {
            throw new Error('Failed to create user');
        }
        const studentPayload = {
            user: createdUser._id,
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            profileImage: payload.profileImage || '',
            currentLevel: payload.currentLevel ?? null,
            coins: 50,
            isDeleted: false,
            needsPasswordChange: payload.googleId ? false : true,
        };
        const [createdStudent] = await student_model_1.Student.create([studentPayload], { session });
        if (!createdStudent) {
            throw new Error('Failed to create student');
        }
        await session.commitTransaction();
        await session.endSession();
        return createdStudent;
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
const createAdminIntoDB = async (payload) => {
    const userData = {};
    userData.password = payload.password || config_1.default.default_pass;
    userData.role = user_constant_1.USER_ROLE.ADMIN;
    userData.email = payload.email;
    userData.name = payload.name;
    const existingAdminByEmail = await admin_model_1.Admin.findOne({
        email: payload.email,
    }).lean();
    if (existingAdminByEmail) {
        throw new Error(`Admin with email ${payload.email} already exists`);
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        userData.id = await (0, user_utils_1.generateAdminId)();
        const [createdUser] = await user_model_1.User.create([userData], { session });
        if (!createdUser) {
            throw new Error('Failed to create user');
        }
        const adminPayload = {
            user: createdUser._id,
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            profileImage: payload.profileImage || '',
            department: 'General',
            isDeleted: false,
            needsPasswordChange: true,
        };
        const [createdAdmin] = await admin_model_1.Admin.create([adminPayload], { session });
        if (!createdAdmin) {
            throw new Error('Failed to create admin');
        }
        await session.commitTransaction();
        await session.endSession();
        return createdAdmin;
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
const createUserIntoDB = async (payload) => {
    if (payload.role === user_constant_1.USER_ROLE.ADMIN) {
        return await createAdminIntoDB(payload);
    }
    else if (payload.role === user_constant_1.USER_ROLE.STUDENT) {
        return await createStudentIntoDB(payload);
    }
    else {
        return await createStudentIntoDB(payload);
    }
};
const getMe = async (userId, role) => {
    let result = null;
    if (role === user_constant_1.USER_ROLE.STUDENT) {
        result = await student_model_1.Student.findOne({ user: userId }).populate('user');
    }
    if (role === user_constant_1.USER_ROLE.ADMIN) {
        result = await admin_model_1.Admin.findOne({ user: userId }).populate('user');
    }
    if (!result) {
        throw new Error('User profile not found');
    }
    return result;
};
const updateProfile = async (userId, role, payload) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        if (payload.name) {
            await user_model_1.User.findByIdAndUpdate(userId, { name: payload.name }, { session, new: true });
        }
        let updatedProfile;
        if (role === user_constant_1.USER_ROLE.STUDENT) {
            const updateData = {};
            if (payload.name)
                updateData.name = payload.name;
            if (payload.profileImage)
                updateData.profileImage = payload.profileImage;
            if (payload.bio !== undefined)
                updateData.bio = payload.bio;
            updatedProfile = await student_model_1.Student.findOneAndUpdate({ user: userId }, updateData, { session, new: true }).populate('user');
        }
        else if (role === user_constant_1.USER_ROLE.ADMIN) {
            const updateData = {};
            if (payload.name)
                updateData.name = payload.name;
            if (payload.profileImage)
                updateData.profileImage = payload.profileImage;
            if (payload.bio !== undefined)
                updateData.bio = payload.bio;
            updatedProfile = await admin_model_1.Admin.findOneAndUpdate({ user: userId }, updateData, { session, new: true }).populate('user');
        }
        if (!updatedProfile) {
            throw new Error('Profile not found');
        }
        await session.commitTransaction();
        await session.endSession();
        return updatedProfile;
    }
    catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};
exports.UserServices = {
    createUserIntoDB,
    createStudentIntoDB,
    createAdminIntoDB,
    getMe,
    updateProfile,
};
//# sourceMappingURL=user.service.js.map