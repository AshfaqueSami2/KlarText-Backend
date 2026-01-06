"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const student_model_1 = require("./student.model");
const user_model_1 = require("../user/user.model");
const updateStudentIntoDB = async (id, payload) => {
    const isStudentExists = await student_model_1.Student.findById(id);
    if (!isStudentExists) {
        throw new Error('Student not found');
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const userUpdateData = {};
        const studentUpdateData = {};
        if (payload.name) {
            userUpdateData.name = payload.name;
            studentUpdateData.name = payload.name;
        }
        if (payload.profileImage) {
            userUpdateData.profileImage = payload.profileImage;
            studentUpdateData.profileImage = payload.profileImage;
        }
        if (payload.bio)
            studentUpdateData.bio = payload.bio;
        if (payload.currentLevel) {
            studentUpdateData.currentLevel = payload.currentLevel;
        }
        if (Object.keys(userUpdateData).length > 0) {
            await user_model_1.User.findByIdAndUpdate(isStudentExists.user, userUpdateData, { new: true, session });
        }
        if (Object.keys(studentUpdateData).length > 0) {
            await student_model_1.Student.findByIdAndUpdate(id, studentUpdateData, { new: true, session });
        }
        await session.commitTransaction();
        await session.endSession();
        return await student_model_1.Student.findById(id).populate('user');
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
const getStudentByUserId = async (userId) => {
    return await student_model_1.Student.findOne({ user: userId });
};
exports.StudentServices = {
    updateStudentIntoDB,
    getStudentByUserId
};
//# sourceMappingURL=student.service.js.map