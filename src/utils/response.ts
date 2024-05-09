export const objectResponse = (status: number, message: string, object = {}) => {
  return {
    status,
    message,
    ...object,
  }
}