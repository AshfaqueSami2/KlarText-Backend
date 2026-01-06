"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceRoomServices = void 0;
const agora_access_token_1 = require("agora-access-token");
const config_1 = __importDefault(require("../../config"));
const voiceRoom_model_1 = require("./voiceRoom.model");
const voiceRoom_interface_1 = require("./voiceRoom.interface");
const voiceRoom_constant_1 = require("./voiceRoom.constant");
const mongoose_1 = require("mongoose");
const generateRoomId = () => {
    return `VR-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
};
const generateAgoraToken = (channelName, uid, userRole) => {
    const appID = config_1.default.agora.app_id;
    const appCertificate = config_1.default.agora.app_certificate;
    if (!appID) {
        throw new Error('Agora App ID not configured');
    }
    if (!appCertificate) {
        console.warn('⚠️ No App Certificate - using testing mode');
        return '';
    }
    const agoraRole = (userRole === voiceRoom_interface_1.UserRole.HOST || userRole === voiceRoom_interface_1.UserRole.SPEAKER)
        ? agora_access_token_1.RtcRole.PUBLISHER
        : agora_access_token_1.RtcRole.SUBSCRIBER;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + voiceRoom_constant_1.TOKEN_EXPIRATION_SECONDS;
    try {
        const token = agora_access_token_1.RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, channelName, uid, agoraRole, privilegeExpiredTs);
        return token;
    }
    catch (error) {
        console.error('Error generating Agora token:', error);
        throw new Error('Failed to generate Agora token');
    }
};
const createVoiceRoom = async (userId, payload) => {
    const roomId = generateRoomId();
    const channelName = roomId;
    const roomData = {
        roomId,
        title: payload.title,
        topic: payload.topic,
        language: payload.language,
        host: new mongoose_1.Types.ObjectId(userId),
        maxSpeakers: payload.maxSpeakers || voiceRoom_constant_1.MAX_SPEAKERS_DEFAULT,
        isPublic: payload.isPublic ?? true,
        isActive: true,
        participants: [
            {
                user: new mongoose_1.Types.ObjectId(userId),
                role: voiceRoom_interface_1.UserRole.HOST,
                joinedAt: new Date(),
                isMuted: false,
                isHandRaised: false,
            },
        ],
        speakerRequests: [],
    };
    if (payload.description) {
        roomData.description = payload.description;
    }
    const newRoom = await voiceRoom_model_1.VoiceRoom.create(roomData);
    const uid = Math.floor(Math.random() * 1000000);
    const token = generateAgoraToken(channelName, uid, voiceRoom_interface_1.UserRole.HOST);
    const populatedRoom = await voiceRoom_model_1.VoiceRoom.findById(newRoom._id)
        .populate('host', 'name profileImage')
        .populate('participants.user', 'name profileImage');
    return {
        room: populatedRoom,
        token,
        channelName,
        uid,
        role: voiceRoom_interface_1.UserRole.HOST,
    };
};
const getActiveRooms = async (filters) => {
    const query = { isActive: true, isPublic: true };
    if (filters?.language)
        query.language = filters.language;
    if (filters?.topic)
        query.topic = filters.topic;
    const rooms = await voiceRoom_model_1.VoiceRoom.find(query)
        .populate('host', 'name profileImage')
        .select('-speakerRequests -participants.isHandRaised')
        .sort({ createdAt: -1 })
        .limit(50);
    return rooms;
};
const getRoomById = async (roomId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId })
        .populate('host', 'name profileImage')
        .populate('participants.user', 'name profileImage')
        .populate('speakerRequests.user', 'name profileImage');
    if (!room) {
        throw new Error('Voice room not found');
    }
    return room;
};
const joinVoiceRoom = async (roomId, userId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    if (!room.isActive) {
        throw new Error('This room is no longer active');
    }
    const existingParticipant = room.participants.find((p) => p.user.toString() === userId);
    if (existingParticipant) {
        const uid = Math.floor(Math.random() * 1000000);
        const token = generateAgoraToken(roomId, uid, existingParticipant.role);
        const populatedRoom = await room.populate('host', 'name profileImage');
        await populatedRoom.populate('participants.user', 'name profileImage');
        return {
            room: populatedRoom,
            token,
            channelName: roomId,
            uid,
            role: existingParticipant.role,
        };
    }
    room.participants.push({
        user: new mongoose_1.Types.ObjectId(userId),
        role: voiceRoom_interface_1.UserRole.LISTENER,
        joinedAt: new Date(),
        isMuted: false,
        isHandRaised: false,
    });
    await room.save();
    const uid = Math.floor(Math.random() * 1000000);
    const token = generateAgoraToken(roomId, uid, voiceRoom_interface_1.UserRole.LISTENER);
    const populatedRoom = await voiceRoom_model_1.VoiceRoom.findOne({ roomId })
        .populate('host', 'name profileImage')
        .populate('participants.user', 'name profileImage');
    return {
        room: populatedRoom,
        token,
        channelName: roomId,
        uid,
        role: voiceRoom_interface_1.UserRole.LISTENER,
    };
};
const applyToSpeak = async (roomId, userId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    const participant = room.participants.find(p => p.user.toString() === userId);
    if (!participant) {
        throw new Error('You must join the room first');
    }
    if (participant.role !== voiceRoom_interface_1.UserRole.LISTENER) {
        throw new Error('Only listeners can apply to speak');
    }
    const existingRequest = room.speakerRequests.find(r => r.user.toString() === userId && r.status === 'pending');
    if (existingRequest) {
        throw new Error('You already have a pending request');
    }
    room.speakerRequests.push({
        user: new mongoose_1.Types.ObjectId(userId),
        requestedAt: new Date(),
        status: 'pending',
    });
    await room.save();
    const savedRoom = await voiceRoom_model_1.VoiceRoom.findOne({ roomId })
        .populate('speakerRequests.user', 'name profileImage');
    const request = savedRoom.speakerRequests[savedRoom.speakerRequests.length - 1];
    return {
        message: 'Speaker request sent',
        requestId: request._id.toString(),
    };
};
const approveSpeakerRequest = async (roomId, requestId, hostId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    if (room.host.toString() !== hostId) {
        throw new Error('Only the host can approve speaker requests');
    }
    const request = room.speakerRequests.id(requestId);
    if (!request || request.status !== 'pending') {
        throw new Error('Request not found or already processed');
    }
    const currentSpeakers = room.participants.filter(p => p.role === voiceRoom_interface_1.UserRole.SPEAKER || p.role === voiceRoom_interface_1.UserRole.HOST).length;
    if (currentSpeakers >= room.maxSpeakers) {
        throw new Error('Speaker limit reached');
    }
    request.status = 'approved';
    const participant = room.participants.find(p => p.user.toString() === request.user.toString());
    if (!participant) {
        throw new Error('Participant not found');
    }
    participant.role = voiceRoom_interface_1.UserRole.SPEAKER;
    participant.isHandRaised = false;
    await room.save();
    const uid = Math.floor(Math.random() * 1000000);
    const token = generateAgoraToken(roomId, uid, voiceRoom_interface_1.UserRole.SPEAKER);
    const populatedRoom = await voiceRoom_model_1.VoiceRoom.findOne({ roomId })
        .populate('host', 'name profileImage')
        .populate('participants.user', 'name profileImage');
    return {
        room: populatedRoom,
        token,
        uid,
        newRole: voiceRoom_interface_1.UserRole.SPEAKER,
        userId: request.user.toString(),
    };
};
const rejectSpeakerRequest = async (roomId, requestId, hostId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    if (room.host.toString() !== hostId) {
        throw new Error('Only the host can reject speaker requests');
    }
    const request = room.speakerRequests.id(requestId);
    if (!request || request.status !== 'pending') {
        throw new Error('Request not found or already processed');
    }
    request.status = 'rejected';
    await room.save();
    return { message: 'Request rejected' };
};
const inviteToSpeak = async (roomId, listenerId, hostId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    if (room.host.toString() !== hostId) {
        throw new Error('Only the host can invite speakers');
    }
    const participant = room.participants.find(p => p.user.toString() === listenerId);
    if (!participant) {
        throw new Error('User is not in the room');
    }
    if (participant.role !== voiceRoom_interface_1.UserRole.LISTENER) {
        throw new Error('Can only invite listeners');
    }
    const currentSpeakers = room.participants.filter(p => p.role === voiceRoom_interface_1.UserRole.SPEAKER || p.role === voiceRoom_interface_1.UserRole.HOST).length;
    if (currentSpeakers >= room.maxSpeakers) {
        throw new Error('Speaker limit reached');
    }
    participant.role = voiceRoom_interface_1.UserRole.SPEAKER;
    await room.save();
    const uid = Math.floor(Math.random() * 1000000);
    const token = generateAgoraToken(roomId, uid, voiceRoom_interface_1.UserRole.SPEAKER);
    const populatedRoom = await voiceRoom_model_1.VoiceRoom.findOne({ roomId })
        .populate('host', 'name profileImage')
        .populate('participants.user', 'name profileImage');
    return {
        room: populatedRoom,
        token,
        uid,
        newRole: voiceRoom_interface_1.UserRole.SPEAKER,
        userId: listenerId,
    };
};
const stepDownToListener = async (roomId, userId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    const participant = room.participants.find(p => p.user.toString() === userId);
    if (!participant) {
        throw new Error('You are not in the room');
    }
    if (participant.role === voiceRoom_interface_1.UserRole.HOST) {
        throw new Error('Host cannot step down');
    }
    if (participant.role !== voiceRoom_interface_1.UserRole.SPEAKER) {
        throw new Error('You are not a speaker');
    }
    participant.role = voiceRoom_interface_1.UserRole.LISTENER;
    await room.save();
    const uid = Math.floor(Math.random() * 1000000);
    const token = generateAgoraToken(roomId, uid, voiceRoom_interface_1.UserRole.LISTENER);
    const populatedRoom = await voiceRoom_model_1.VoiceRoom.findOne({ roomId })
        .populate('host', 'name profileImage')
        .populate('participants.user', 'name profileImage');
    return {
        room: populatedRoom,
        token,
        uid,
        newRole: voiceRoom_interface_1.UserRole.LISTENER,
    };
};
const leaveVoiceRoom = async (roomId, userId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    const participant = room.participants.find(p => p.user.toString() === userId);
    if (!participant) {
        throw new Error('You are not in the room');
    }
    if (room.host.toString() === userId) {
        room.isActive = false;
        room.closedAt = new Date();
        room.participants = [];
        await room.save();
        return { message: 'Room closed', roomClosed: true };
    }
    room.participants = room.participants.filter((p) => p.user.toString() !== userId);
    await room.save();
    return { message: 'Left room successfully', roomClosed: false };
};
const muteSpeaker = async (roomId, speakerId, hostId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    if (room.host.toString() !== hostId) {
        throw new Error('Only the host can mute speakers');
    }
    const participant = room.participants.find(p => p.user.toString() === speakerId);
    if (!participant) {
        throw new Error('Speaker not found');
    }
    if (participant.role !== voiceRoom_interface_1.UserRole.SPEAKER) {
        throw new Error('Can only mute speakers');
    }
    participant.isMuted = !participant.isMuted;
    await room.save();
    return {
        message: participant.isMuted ? 'Speaker muted' : 'Speaker unmuted',
        isMuted: participant.isMuted
    };
};
const removeParticipant = async (roomId, participantId, hostId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    if (room.host.toString() !== hostId) {
        throw new Error('Only the host can remove participants');
    }
    if (participantId === hostId) {
        throw new Error('Host cannot remove themselves');
    }
    room.participants = room.participants.filter(p => p.user.toString() !== participantId);
    await room.save();
    return { message: 'Participant removed' };
};
const getUserActiveRoom = async (userId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({
        isActive: true,
        'participants.user': new mongoose_1.Types.ObjectId(userId),
    })
        .populate('host', 'name profileImage')
        .populate('participants.user', 'name profileImage');
    return room;
};
const refreshToken = async (roomId, userId) => {
    const room = await voiceRoom_model_1.VoiceRoom.findOne({ roomId });
    if (!room) {
        throw new Error('Voice room not found');
    }
    if (!room.isActive) {
        throw new Error('Room is not active');
    }
    const participant = room.participants.find(p => p.user.toString() === userId);
    if (!participant) {
        throw new Error('You are not in this room');
    }
    const uid = Math.floor(Math.random() * 1000000);
    const token = generateAgoraToken(roomId, uid, participant.role);
    return {
        token,
        channelName: roomId,
        uid,
        role: participant.role,
    };
};
exports.VoiceRoomServices = {
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
//# sourceMappingURL=voiceRoom.service.js.map