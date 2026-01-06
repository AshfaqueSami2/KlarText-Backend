import { NextFunction, Request, Response } from 'express'
import { HttpStatus } from 'http-status-ts'

const notFound = (req: Request, res: Response, next: NextFunction) => {
  return res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: 'API route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`,
  })
}

export default notFound
