import jwt from 'jsonwebtoken';
export declare const createToken: (jwtPayload: {
    userId: string;
    role: string;
}, secret: string, expiresIn: string) => string;
export declare const verifyToken: (token: string, secret: string) => string | jwt.JwtPayload;
//# sourceMappingURL=auth.utils.d.ts.map