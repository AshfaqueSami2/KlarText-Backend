"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../user/user.constant");
const studentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profileImage: { type: String, default: '' },
    currentLevel: {
        type: String,
        enum: user_constant_1.GERMAN_LEVELS,
        required: false,
        default: null
    },
    coins: { type: Number, default: 0 },
    subscriptionStatus: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    subscriptionPlan: {
        type: String,
        enum: ['monthly', 'yearly', 'lifetime'],
        default: null
    },
    subscriptionExpiry: {
        type: Date,
        default: null
    },
    subscriptionPrice: {
        type: Number,
        default: 0
    },
    isDeleted: { type: Boolean, default: false },
    needsPasswordChange: { type: Boolean, default: true },
}, { timestamps: true });
studentSchema.index({ email: 1 });
studentSchema.index({ currentLevel: 1 });
studentSchema.index({ isDeleted: 1 });
studentSchema.index({ coins: -1 });
exports.Student = (0, mongoose_1.model)('Student', studentSchema);
//# sourceMappingURL=student.model.js.map