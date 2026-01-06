import { Request, Response } from 'express';
export declare const AuthControllers: {
    loginUser: (req: Request, res: Response) => Promise<void>;
    logoutUser: (req: Request, res: Response) => Promise<void>;
    googleCallback: (req: Request, res: Response) => Promise<void>;
    googleFailure: (req: Request, res: Response) => void;
};
//# sourceMappingURL=auth.controller.d.ts.map