export function formatDate(date: Date) {
  return date.toISOString().slice(0, 19)
}