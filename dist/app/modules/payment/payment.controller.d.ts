import { Request, Response } from 'express';
export declare const PaymentControllers: {
    initPayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
    paymentSuccess: (req: Request, res: Response, next: import("express").NextFunction) => void;
    paymentFail: (req: Request, res: Response, next: import("express").NextFunction) => void;
    paymentCancel: (req: Request, res: Response, next: import("express").NextFunction) => void;
    paymentIPN: (req: Request, res: Response, next: import("express").NextFunction) => void;
};
//# sourceMappingURL=payment.controller.d.ts.map