export default function objectResponse(status: number, message: string, object = {}) {
  return {
    status,
    message,
    ...object,
  }
}