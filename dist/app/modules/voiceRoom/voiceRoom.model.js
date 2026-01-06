"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceRoom = void 0;
const mongoose_1 = require("mongoose");
const voiceRoom_interface_1 = require("./voiceRoom.interface");
const voiceRoom_constant_1 = require("./voiceRoom.constant");
const participantSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: Object.values(voiceRoom_interface_1.UserRole),
        required: true,
        default: voiceRoom_interface_1.UserRole.LISTENER
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    isMuted: {
        type: Boolean,
        default: false
    },
    isHandRaised: {
        type: Boolean,
        default: false
    }
}, { _id: false });
const speakerRequestSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { _id: true });
const voiceRoomSchema = new mongoose_1.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    topic: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true,
        default: 'German'
    },
    host: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    maxSpeakers: {
        type: Number,
        default: voiceRoom_constant_1.MAX_SPEAKERS_DEFAULT,
        min: 1,
        max: 20
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    participants: [participantSchema],
    speakerRequests: [speakerRequestSchema],
    closedAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
voiceRoomSchema.virtual('participantCount').get(function () {
    return this.participants.length;
});
voiceRoomSchema.virtual('speakerCount').get(function () {
    return this.participants.filter(p => p.role === voiceRoom_interface_1.UserRole.SPEAKER || p.role === voiceRoom_interface_1.UserRole.HOST).length;
});
voiceRoomSchema.virtual('listenerCount').get(function () {
    return this.participants.filter(p => p.role === voiceRoom_interface_1.UserRole.LISTENER).length;
});
voiceRoomSchema.index({ isActive: 1, isPublic: 1, createdAt: -1 });
voiceRoomSchema.index({ 'participants.user': 1 });
voiceRoomSchema.index({ host: 1, isActive: 1 });
exports.VoiceRoom = (0, mongoose_1.model)('VoiceRoom', voiceRoomSchema);
//# sourceMappingURL=voiceRoom.model.js.map