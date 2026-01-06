import { ZodError, ZodIssue } from 'zod'
import { TErrorSources, TGenericErrorResponse } from '../interface/error'

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources[] = err.issues.map((issue: ZodIssue) => {
    const lastPath = issue.path[issue.path.length - 1]
    const normalizedPath: string | number =
      typeof lastPath === 'string' || typeof lastPath === 'number'
        ? lastPath
        : String(lastPath)

    return {
      path: normalizedPath,
      message: issue.message,
    }
  })

  const statusCode = 400

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  }
}

export default handleZodError
