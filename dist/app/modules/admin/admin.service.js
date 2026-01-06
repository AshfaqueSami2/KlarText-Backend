"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const admin_model_1 = require("./admin.model");
const user_model_1 = require("../user/user.model");
const updateAdminIntoDB = async (id, payload) => {
    const isAdminExists = await admin_model_1.Admin.findById(id);
    if (!isAdminExists) {
        throw new Error('Admin not found');
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const userUpdateData = {};
        const adminUpdateData = {};
        if (payload.name) {
            userUpdateData.name = payload.name;
            adminUpdateData.name = payload.name;
        }
        if (payload.profileImage) {
            userUpdateData.profileImage = payload.profileImage;
            adminUpdateData.profileImage = payload.profileImage;
        }
        if (payload.department) {
            adminUpdateData.department = payload.department;
        }
        if (Object.keys(userUpdateData).length > 0) {
            await user_model_1.User.findByIdAndUpdate(isAdminExists.user, userUpdateData, { new: true, runValidators: true, session });
        }
        if (Object.keys(adminUpdateData).length > 0) {
            await admin_model_1.Admin.findByIdAndUpdate(id, adminUpdateData, { new: true, runValidators: true, session });
        }
        await session.commitTransaction();
        await session.endSession();
        const result = await admin_model_1.Admin.findById(id).populate('user');
        return result;
    }
    catch (err) {
        await session.abortTransaction();
        await session.endSession();
        throw err;
    }
};
exports.AdminServices = {
    updateAdminIntoDB,
};
//# sourceMappingURL=admin.service.js.map