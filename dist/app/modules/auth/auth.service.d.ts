import { TLoginUser } from './auth.interface';
export declare const AuthServices: {
    loginUser: (payload: TLoginUser) => Promise<{
        accessToken: string;
        refreshToken: string;
        needsPasswordChange: boolean;
    }>;
    logoutUser: () => Promise<{
        message: string;
    }>;
    googleAuthSuccess: (user: any) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            profileImage: any;
            student: any;
        };
        authMethod: string;
        needsPasswordChange: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=auth.service.d.ts.map