import { Request, Response } from 'express';
export declare const VoiceRoomControllers: {
    createVoiceRoom: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getActiveRooms: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getRoomById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    joinVoiceRoom: (req: Request, res: Response, next: import("express").NextFunction) => void;
    applyToSpeak: (req: Request, res: Response, next: import("express").NextFunction) => void;
    approveSpeakerRequest: (req: Request, res: Response, next: import("express").NextFunction) => void;
    rejectSpeakerRequest: (req: Request, res: Response, next: import("express").NextFunction) => void;
    inviteToSpeak: (req: Request, res: Response, next: import("express").NextFunction) => void;
    stepDownToListener: (req: Request, res: Response, next: import("express").NextFunction) => void;
    leaveVoiceRoom: (req: Request, res: Response, next: import("express").NextFunction) => void;
    muteSpeaker: (req: Request, res: Response, next: import("express").NextFunction) => void;
    removeParticipant: (req: Request, res: Response, next: import("express").NextFunction) => void;
    getUserActiveRoom: (req: Request, res: Response, next: import("express").NextFunction) => void;
    refreshToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=voiceRoom.controller.d.ts.map