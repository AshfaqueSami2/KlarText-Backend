import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import config from '../config'
import { TErrorSources } from '../interface/error'
import AppError from '../Error/AppError'
import handleZodError from '../Error/handleZodError'
import handleDuplicateError from '../Error/handleDuplicateError'
import handleValidationError from '../Error/handleValidationError'
import handleCastError from '../Error/handleCastError'
import logger from '../utils/logger'

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500
  let message = 'Something went wrong'

  let errorSources: TErrorSources[] = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ]

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const simplifiedErrors = handleZodError(err)
    statusCode = simplifiedErrors?.statusCode
    message = simplifiedErrors?.message
    errorSources = simplifiedErrors?.errorSources
}
// Handle custom AppError (domain errors)
else if (err instanceof AppError) {
    statusCode = err.statusCode || 500
    message = err.message || 'Application error'
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }
  // Handle Mongo duplicate key error (unique index violation)
  // else if (err?.code === 11000) {
  //   statusCode = 409
  //   message = 'Duplicate key error'
  //   const fields = Object.keys(err.keyPattern || err.keyValue || {})
  //   errorSources = fields.length
  //     ? fields.map((f: string) => ({ path: f, message: `${f} must be unique` }))
  //     : [
  //         {
  //           path: '',
  //           message: 'Duplicate value violates unique constraint',
  //         },
  //       ]
  // }
  else if (err?.code === 11000) {
   const simplifiedErrors = handleDuplicateError(err)
    statusCode = simplifiedErrors?.statusCode
    message = simplifiedErrors?.message
    errorSources = simplifiedErrors?.errorSources
  }
  else if (err instanceof Error ) {
   
   message = err?.message;
   errorSources = [
   {
     path:'',
    message:err?.message,
   }
   ]
  }
  // Handle Mongoose validation errors
  else if (err?.name === 'ValidationError') {
    const simplifiedErrors = handleValidationError(err)
    statusCode = simplifiedErrors?.statusCode
    message = simplifiedErrors?.message
    errorSources = simplifiedErrors?.errorSources
  }
else if(err?.name==='CastError'){
    const simplifiedErrors = handleCastError(err)
    statusCode = simplifiedErrors?.statusCode
    message = simplifiedErrors?.message
    errorSources = simplifiedErrors?.errorSources
}


  // Handle custom AppError (from your models)
  // Note: Now handled above.

  // Log the error
  logger.error(`${req.method} ${req.originalUrl} - ${statusCode}`, {
    message,
    errorSources,
    stack: err.stack,
    userId: (req as any).user?._id,
    ip: req.ip,
  });

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    err: config.env === 'development' ? err : undefined,
    stack: config.env === 'development' ? err.stack : null,
  })
}

export default globalErrorHandler
