import { Types } from 'mongoose';
import { GERMAN_LEVELS } from '../user/user.constant';
export type TStudentLevel = (typeof GERMAN_LEVELS)[number];
export interface IStudent {
    user: Types.ObjectId;
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    currentLevel: TStudentLevel | null;
    coins: number;
    subscriptionStatus: 'free' | 'premium';
    subscriptionPlan?: 'monthly' | 'yearly' | 'lifetime' | null;
    subscriptionExpiry?: Date | null;
    subscriptionPrice?: number;
    isDeleted: boolean;
    needsPasswordChange: boolean;
}
//# sourceMappingURL=student.interface.d.ts.map