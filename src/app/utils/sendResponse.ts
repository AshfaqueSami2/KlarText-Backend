import { Response } from 'express'

type TMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

type TResponse<T> = {
  statusCode: number
  success: boolean
  message?: string
  data: T
  meta?: TMeta
  audioUrl?: string
  mimeType?: string
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const response: any = {
    success: data.success,
    message: data.message,
  }
  
  // Add audioUrl and mimeType at top level if provided
  if (data.audioUrl) {
    response.audioUrl = data.audioUrl
  }
  if (data.mimeType) {
    response.mimeType = data.mimeType
  }
  
  // Always include data
  response.data = data.data
  
  // Add pagination meta if provided
  if (data.meta) {
    response.meta = data.meta
  }
  
  res.status(data.statusCode).json(response)
}

export default sendResponse
