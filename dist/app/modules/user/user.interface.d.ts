import { Types, Model } from 'mongoose';
import { TUserRole } from './user.constant';
export interface IUser {
    _id: Types.ObjectId;
    id: string;
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    role: TUserRole;
    profileImage?: string;
    isDeleted: boolean;
    needsPasswordChange: boolean;
}
export interface IUserMethods {
    isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
export interface UserModel extends Model<IUser, {}, IUserMethods> {
    isUserExistsByEmail(email: string): Promise<(IUser & IUserMethods) | null>;
}
export type TCreateUserPayload = {
    name: string;
    email: string;
    password?: string;
    role: TUserRole;
    profileImage?: string;
    currentLevel?: string;
};
//# sourceMappingURL=user.interface.d.ts.map