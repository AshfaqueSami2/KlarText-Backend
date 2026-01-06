import mongoose from 'mongoose';
import { TCreateUserPayload } from './user.interface';
export declare const UserServices: {
    createUserIntoDB: (payload: TCreateUserPayload) => Promise<(mongoose.Document<unknown, {}, import("../admin/admin.interface").IAdmin, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & import("../admin/admin.interface").IAdmin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | (mongoose.Document<unknown, {}, import("../student/student.interface").IStudent, {}, mongoose.DefaultSchemaOptions> & import("../student/student.interface").IStudent & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    })>;
    createStudentIntoDB: (payload: TCreateUserPayload & {
        googleId?: string;
    }) => Promise<mongoose.Document<unknown, {}, import("../student/student.interface").IStudent, {}, mongoose.DefaultSchemaOptions> & import("../student/student.interface").IStudent & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
    createAdminIntoDB: (payload: TCreateUserPayload) => Promise<mongoose.Document<unknown, {}, import("../admin/admin.interface").IAdmin, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & import("../admin/admin.interface").IAdmin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMe: (userId: string, role: string) => Promise<(mongoose.Document<unknown, {}, import("../admin/admin.interface").IAdmin, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & import("../admin/admin.interface").IAdmin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | (mongoose.Document<unknown, {}, import("../student/student.interface").IStudent, {}, mongoose.DefaultSchemaOptions> & import("../student/student.interface").IStudent & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    })>;
    updateProfile: (userId: string, role: string, payload: {
        name?: string;
        profileImage?: string;
        bio?: string;
    }) => Promise<(mongoose.Document<unknown, {}, import("../admin/admin.interface").IAdmin, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & import("../admin/admin.interface").IAdmin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | (mongoose.Document<unknown, {}, import("../student/student.interface").IStudent, {}, mongoose.DefaultSchemaOptions> & import("../student/student.interface").IStudent & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    })>;
};
//# sourceMappingURL=user.service.d.ts.map