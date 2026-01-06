"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeParticipantValidationSchema = exports.muteSpeakerValidationSchema = exports.inviteToSpeakValidationSchema = exports.requestIdParamValidationSchema = exports.roomIdParamValidationSchema = exports.createVoiceRoomValidationSchema = void 0;
const zod_1 = require("zod");
const voiceRoom_constant_1 = require("./voiceRoom.constant");
exports.createVoiceRoomValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
        description: zod_1.z.string().max(500, 'Description too long').optional(),
        topic: zod_1.z.string().min(1, 'Topic is required'),
        language: zod_1.z.string().min(1, 'Language is required'),
        maxSpeakers: zod_1.z.number().int().min(1).max(voiceRoom_constant_1.MAX_SPEAKERS_LIMIT).optional(),
        isPublic: zod_1.z.boolean().optional(),
    }),
});
exports.roomIdParamValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        roomId: zod_1.z.string().min(1, 'Room ID is required'),
    }),
});
exports.requestIdParamValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        roomId: zod_1.z.string().min(1, 'Room ID is required'),
        requestId: zod_1.z.string().min(1, 'Request ID is required'),
    }),
});
exports.inviteToSpeakValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        roomId: zod_1.z.string().min(1, 'Room ID is required'),
    }),
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1, 'User ID is required'),
    }),
});
exports.muteSpeakerValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        roomId: zod_1.z.string().min(1, 'Room ID is required'),
    }),
    body: zod_1.z.object({
        speakerId: zod_1.z.string().min(1, 'Speaker ID is required'),
    }),
});
exports.removeParticipantValidationSchema = zod_1.z.object({
    params: zod_1.z.object({
        roomId: zod_1.z.string().min(1, 'Room ID is required'),
    }),
    body: zod_1.z.object({
        participantId: zod_1.z.string().min(1, 'Participant ID is required'),
    }),
});
//# sourceMappingURL=voiceRoom.validation.js.map