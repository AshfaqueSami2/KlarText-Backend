import mongoose from 'mongoose';
type TStudentUpdatePayload = {
    name?: string;
    profileImage?: string;
    bio?: string;
    currentLevel?: string;
};
export declare const StudentServices: {
    updateStudentIntoDB: (id: string, payload: TStudentUpdatePayload) => Promise<(mongoose.Document<unknown, {}, import("./student.interface").IStudent, {}, mongoose.DefaultSchemaOptions> & import("./student.interface").IStudent & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getStudentByUserId: (userId: string) => Promise<(mongoose.Document<unknown, {}, import("./student.interface").IStudent, {}, mongoose.DefaultSchemaOptions> & import("./student.interface").IStudent & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
};
export {};
//# sourceMappingURL=student.service.d.ts.map