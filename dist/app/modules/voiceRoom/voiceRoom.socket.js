"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeVoiceRoomSocket = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const voiceRoom_model_1 = require("./voiceRoom.model");
const initializeVoiceRoomSocket = (io) => {
    const voiceRoomNamespace = io.of('/voice-rooms');
    voiceRoomNamespace.on('connection', (socket) => {
        logger_1.default.info(`Socket connected: ${socket.id}`);
        socket.on('room:join', async (data) => {
            try {
                const { roomId, userId, userName, role } = data;
                socket.data = { userId, roomId, userName, role };
                socket.join(roomId);
                logger_1.default.info(`User ${userId} joined room ${roomId} as ${role}`);
                socket.to(roomId).emit('room:user-joined', {
                    userId,
                    userName,
                    role,
                    timestamp: new Date(),
                });
                socket.emit('room:joined-success', {
                    roomId,
                    message: 'Successfully joined the room',
                });
            }
            catch (error) {
                logger_1.default.error('Error joining room:', error);
                socket.emit('room:error', { message: 'Failed to join room' });
            }
        });
        socket.on('room:leave', async (data) => {
            try {
                const { roomId, userId } = data;
                socket.leave(roomId);
                logger_1.default.info(`User ${userId} left room ${roomId}`);
                socket.to(roomId).emit('room:user-left', {
                    userId,
                    timestamp: new Date(),
                });
            }
            catch (error) {
                logger_1.default.error('Error leaving room:', error);
            }
        });
        socket.on('request:speak', async (data) => {
            try {
                const { roomId, userId, userName, requestId } = data;
                const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
                if (!room)
                    return;
                socket.to(roomId).emit('request:speak', {
                    userId,
                    userName,
                    requestId,
                    timestamp: new Date(),
                });
                logger_1.default.info(`User ${userId} requested to speak in room ${roomId}`);
            }
            catch (error) {
                logger_1.default.error('Error processing speak request:', error);
            }
        });
        socket.on('role:updated', async (data) => {
            try {
                const { roomId, userId, newRole, token, uid } = data;
                voiceRoomNamespace.to(roomId).emit('role:updated', {
                    userId,
                    newRole,
                    token,
                    uid,
                    timestamp: new Date(),
                });
                logger_1.default.info(`User ${userId} role updated to ${newRole} in room ${roomId}`);
            }
            catch (error) {
                logger_1.default.error('Error updating role:', error);
            }
        });
        socket.on('invite:speak', async (data) => {
            try {
                const { roomId, userId, invitedBy } = data;
                voiceRoomNamespace.to(roomId).emit('invite:speak', {
                    userId,
                    invitedBy,
                    timestamp: new Date(),
                });
                logger_1.default.info(`User ${userId} invited to speak in room ${roomId}`);
            }
            catch (error) {
                logger_1.default.error('Error sending invite:', error);
            }
        });
        socket.on('speaker:muted', async (data) => {
            try {
                const { roomId, speakerId, isMuted } = data;
                voiceRoomNamespace.to(roomId).emit('speaker:muted', {
                    speakerId,
                    isMuted,
                    timestamp: new Date(),
                });
                logger_1.default.info(`Speaker ${speakerId} ${isMuted ? 'muted' : 'unmuted'} in room ${roomId}`);
            }
            catch (error) {
                logger_1.default.error('Error muting speaker:', error);
            }
        });
        socket.on('participant:removed', async (data) => {
            try {
                const { roomId, participantId } = data;
                voiceRoomNamespace.to(roomId).emit('participant:removed', {
                    participantId,
                    timestamp: new Date(),
                });
                logger_1.default.info(`Participant ${participantId} removed from room ${roomId}`);
            }
            catch (error) {
                logger_1.default.error('Error removing participant:', error);
            }
        });
        socket.on('room:close', async (data) => {
            try {
                const { roomId } = data;
                logger_1.default.info(`Room ${roomId} closed`);
                voiceRoomNamespace.to(roomId).emit('room:closed', {
                    message: 'Room has been closed by the host',
                    timestamp: new Date(),
                });
                const sockets = await voiceRoomNamespace.in(roomId).fetchSockets();
                sockets.forEach((s) => s.leave(roomId));
            }
            catch (error) {
                logger_1.default.error('Error closing room:', error);
            }
        });
        socket.on('speaking:status', (data) => {
            const { roomId, userId, isSpeaking } = data;
            socket.to(roomId).emit('speaking:status', { userId, isSpeaking });
        });
        socket.on('disconnect', async () => {
            try {
                const userData = socket.data;
                if (userData?.roomId && userData?.userId) {
                    logger_1.default.info(`User ${userData.userId} disconnected from room ${userData.roomId}`);
                    socket.to(userData.roomId).emit('room:user-left', {
                        userId: userData.userId,
                        timestamp: new Date(),
                    });
                }
                logger_1.default.info(`Socket disconnected: ${socket.id}`);
            }
            catch (error) {
                logger_1.default.error('Error handling disconnect:', error);
            }
        });
        socket.on('error', (error) => {
            logger_1.default.error('Socket error:', error);
        });
    });
    logger_1.default.info('✅ Voice Room Socket.IO handlers initialized');
};
exports.initializeVoiceRoomSocket = initializeVoiceRoomSocket;
//# sourceMappingURL=voiceRoom.socket.js.map