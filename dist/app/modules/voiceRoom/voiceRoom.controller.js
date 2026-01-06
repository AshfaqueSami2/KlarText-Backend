"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceRoomControllers = void 0;
const voiceRoom_service_1 = require("./voiceRoom.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_ts_1 = require("http-status-ts");
const createVoiceRoom = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await voiceRoom_service_1.VoiceRoomServices.createVoiceRoom(user.userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.CREATED,
        success: true,
        message: 'Voice room created successfully',
        data: result,
    });
});
const getActiveRooms = (0, catchAsync_1.default)(async (req, res) => {
    const { language, topic } = req.query;
    const filters = {};
    if (language)
        filters.language = language;
    if (topic)
        filters.topic = topic;
    const result = await voiceRoom_service_1.VoiceRoomServices.getActiveRooms(filters);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Active rooms retrieved successfully',
        data: result,
    });
});
const getRoomById = (0, catchAsync_1.default)(async (req, res) => {
    const { roomId } = req.params;
    const result = await voiceRoom_service_1.VoiceRoomServices.getRoomById(roomId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Room details retrieved successfully',
        data: result,
    });
});
const joinVoiceRoom = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId } = req.params;
    const result = await voiceRoom_service_1.VoiceRoomServices.joinVoiceRoom(roomId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Joined room successfully',
        data: result,
    });
});
const applyToSpeak = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId } = req.params;
    const result = await voiceRoom_service_1.VoiceRoomServices.applyToSpeak(roomId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: result.message,
        data: result,
    });
});
const approveSpeakerRequest = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId, requestId } = req.params;
    const result = await voiceRoom_service_1.VoiceRoomServices.approveSpeakerRequest(roomId, requestId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Speaker request approved',
        data: result,
    });
});
const rejectSpeakerRequest = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId, requestId } = req.params;
    const result = await voiceRoom_service_1.VoiceRoomServices.rejectSpeakerRequest(roomId, requestId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: result.message,
        data: result,
    });
});
const inviteToSpeak = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId } = req.params;
    const { userId: listenerId } = req.body;
    const result = await voiceRoom_service_1.VoiceRoomServices.inviteToSpeak(roomId, listenerId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Speaker invited successfully',
        data: result,
    });
});
const stepDownToListener = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId } = req.params;
    const result = await voiceRoom_service_1.VoiceRoomServices.stepDownToListener(roomId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Stepped down to listener',
        data: result,
    });
});
const leaveVoiceRoom = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId } = req.params;
    const result = await voiceRoom_service_1.VoiceRoomServices.leaveVoiceRoom(roomId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: result.message,
        data: result,
    });
});
const muteSpeaker = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId } = req.params;
    const { speakerId } = req.body;
    const result = await voiceRoom_service_1.VoiceRoomServices.muteSpeaker(roomId, speakerId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: result.message,
        data: result,
    });
});
const removeParticipant = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId } = req.params;
    const { participantId } = req.body;
    const result = await voiceRoom_service_1.VoiceRoomServices.removeParticipant(roomId, participantId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: result.message,
        data: result,
    });
});
const getUserActiveRoom = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await voiceRoom_service_1.VoiceRoomServices.getUserActiveRoom(user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: result ? 'Active room found' : 'No active room',
        data: result,
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { roomId } = req.params;
    const result = await voiceRoom_service_1.VoiceRoomServices.refreshToken(roomId, user.userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_ts_1.HttpStatus.OK,
        success: true,
        message: 'Token refreshed successfully',
        data: result,
    });
});
exports.VoiceRoomControllers = {
    createVoiceRoom,
    getActiveRooms,
    getRoomById,
    joinVoiceRoom,
    applyToSpeak,
    approveSpeakerRequest,
    rejectSpeakerRequest,
    inviteToSpeak,
    stepDownToListener,
    leaveVoiceRoom,
    muteSpeaker,
    removeParticipant,
    getUserActiveRoom,
    refreshToken,
};
//# sourceMappingURL=voiceRoom.controller.js.map