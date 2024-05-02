export default function frontResult(status: number, message: string, object: Object,) {
  return {
    status,
    message,
    ...object,
  }
}