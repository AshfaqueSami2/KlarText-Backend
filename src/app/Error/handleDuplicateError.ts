import { TErrorSources, TGenericErrorResponse } from '../interface/error'

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Prefer Mongo's structured key/value; fallback to regex extraction
  const keyValue = err?.keyValue || {}
  const keys = Object.keys(keyValue)

  let errorSources: TErrorSources[]

  if (keys.length > 0) {
    errorSources = keys.map((key: string) => {
      const value = keyValue[key]
      return {
        path: key,
        message: `"${value}" already exists`,
      }
    })
  } else {
    // Fallback: Extract first quoted value from the error message
    const match =
      typeof err?.message === 'string' ? err.message.match(/"([^"]*)"/) : null
    const extracted = match && match[1]
    errorSources = [
      {
        path: '',
        message: extracted
          ? `"${extracted}" already exists`
          : 'Duplicate value already exists',
      },
    ]
  }

  const statusCode = 409

  return {
    statusCode,
    message: 'Duplicate value',
    errorSources,
  }
}

export default handleDuplicateError
