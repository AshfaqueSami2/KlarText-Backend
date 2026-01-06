import { ICreateVoiceRoomPayload, IAgoraTokenResponse, UserRole } from './voiceRoom.interface';
import { Types } from 'mongoose';
export declare const VoiceRoomServices: {
    createVoiceRoom: (userId: string, payload: ICreateVoiceRoomPayload) => Promise<{
        room: (import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        token: string;
        channelName: string;
        uid: number;
        role: UserRole;
    }>;
    getActiveRooms: (filters?: {
        language?: string;
        topic?: string;
    }) => Promise<(import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getRoomById: (roomId: string) => Promise<import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    joinVoiceRoom: (roomId: string, userId: string) => Promise<{
        room: Omit<import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }, never>;
        token: string;
        channelName: string;
        uid: number;
        role: UserRole;
    } | {
        room: (import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        token: string;
        channelName: string;
        uid: number;
        role: UserRole;
    }>;
    applyToSpeak: (roomId: string, userId: string) => Promise<{
        message: string;
        requestId: any;
    }>;
    approveSpeakerRequest: (roomId: string, requestId: string, hostId: string) => Promise<{
        room: (import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        token: string;
        uid: number;
        newRole: UserRole;
        userId: any;
    }>;
    rejectSpeakerRequest: (roomId: string, requestId: string, hostId: string) => Promise<{
        message: string;
    }>;
    inviteToSpeak: (roomId: string, listenerId: string, hostId: string) => Promise<{
        room: (import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        token: string;
        uid: number;
        newRole: UserRole;
        userId: string;
    }>;
    stepDownToListener: (roomId: string, userId: string) => Promise<{
        room: (import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        token: string;
        uid: number;
        newRole: UserRole;
    }>;
    leaveVoiceRoom: (roomId: string, userId: string) => Promise<{
        message: string;
        roomClosed: boolean;
    }>;
    muteSpeaker: (roomId: string, speakerId: string, hostId: string) => Promise<{
        message: string;
        isMuted: boolean;
    }>;
    removeParticipant: (roomId: string, participantId: string, hostId: string) => Promise<{
        message: string;
    }>;
    getUserActiveRoom: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("./voiceRoom.interface").IVoiceRoom, {}, import("mongoose").DefaultSchemaOptions> & import("./voiceRoom.interface").IVoiceRoom & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    refreshToken: (roomId: string, userId: string) => Promise<IAgoraTokenResponse>;
};
//# sourceMappingURL=voiceRoom.service.d.ts.map