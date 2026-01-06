import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
declare const validateRequest: (schema: z.ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => void;
export default validateRequest;
//# sourceMappingURL=validateRequest.d.ts.map