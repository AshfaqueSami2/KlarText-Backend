import { Types } from 'mongoose';
export declare enum UserRole {
    HOST = "host",
    SPEAKER = "speaker",
    LISTENER = "listener"
}
export interface IParticipant {
    user: Types.ObjectId;
    role: UserRole;
    joinedAt: Date;
    isMuted: boolean;
    isHandRaised: boolean;
}
export interface ISpeakerRequest {
    user: Types.ObjectId;
    requestedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
}
export interface IVoiceRoom {
    _id?: Types.ObjectId;
    roomId: string;
    title: string;
    description?: string;
    topic: string;
    language: string;
    host: Types.ObjectId;
    maxSpeakers: number;
    isActive: boolean;
    isPublic: boolean;
    participants: IParticipant[];
    speakerRequests: ISpeakerRequest[];
    createdAt: Date;
    closedAt?: Date;
}
export interface ICreateVoiceRoomPayload {
    title: string;
    description?: string;
    topic: string;
    language: string;
    maxSpeakers?: number;
    isPublic?: boolean;
}
export interface IJoinRoomResponse {
    room: IVoiceRoom;
    token: string;
    channelName: string;
    uid: number;
    role: UserRole;
}
export interface IAgoraTokenResponse {
    token: string;
    channelName: string;
    uid: number;
    role: UserRole;
}
export interface IApplySpeakResponse {
    message: string;
    requestId: string;
}
export interface IRoleChangeResponse {
    room: IVoiceRoom;
    token: string;
    uid: number;
    newRole: UserRole;
}
//# sourceMappingURL=voiceRoom.interface.d.ts.map