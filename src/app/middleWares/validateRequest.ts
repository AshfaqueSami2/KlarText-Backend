import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import catchAsync from '../utils/catchAsync';

const validateRequest = (schema: z.ZodTypeAny) => {
  return catchAsync(async (req: Request, _res: Response, next: NextFunction) => {
    const validationData: any = {
      body: req.body,
      cookies: req.cookies,
    }
    
    // Only add params if they exist
    if (Object.keys(req.params).length > 0) {
      validationData.params = req.params
    }
    
    // Only add query if it exists  
    if (Object.keys(req.query).length > 0) {
      validationData.query = req.query
    }

    await schema.parseAsync(validationData)

    next()
  })
}

export default validateRequest
