export function objectResponse(status: number, message: string, object = {}) {
  return {
    status,
    message,
    ...object,
  }
}