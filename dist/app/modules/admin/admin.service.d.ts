import mongoose from 'mongoose';
type TAdminUpdatePayload = {
    name?: string;
    profileImage?: string;
    department?: string;
};
export declare const AdminServices: {
    updateAdminIntoDB: (id: string, payload: TAdminUpdatePayload) => Promise<(mongoose.Document<unknown, {}, import("./admin.interface").IAdmin, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & import("./admin.interface").IAdmin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
};
export {};
//# sourceMappingURL=admin.service.d.ts.map