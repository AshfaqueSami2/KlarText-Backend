import { Types } from "mongoose";
export interface IAdmin {
    user: Types.ObjectId;
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    isDeleted: boolean;
    needsPasswordChange: boolean;
}
//# sourceMappingURL=admin.interface.d.ts.map