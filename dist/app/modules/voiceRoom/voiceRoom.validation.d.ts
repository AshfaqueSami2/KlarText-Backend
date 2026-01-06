import { z } from 'zod';
export declare const createVoiceRoomValidationSchema: z.ZodObject<{
    body: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        topic: z.ZodString;
        language: z.ZodString;
        maxSpeakers: z.ZodOptional<z.ZodNumber>;
        isPublic: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const roomIdParamValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        roomId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const requestIdParamValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        roomId: z.ZodString;
        requestId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const inviteToSpeakValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        roomId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        userId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const muteSpeakerValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        roomId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        speakerId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const removeParticipantValidationSchema: z.ZodObject<{
    params: z.ZodObject<{
        roomId: z.ZodString;
    }, z.core.$strip>;
    body: z.ZodObject<{
        participantId: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=voiceRoom.validation.d.ts.map