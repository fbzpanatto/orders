import { format } from 'date-fns';

export function formatDate(date: Date): string {
  const localDate = new Date(date.getTime() + (3 * 60 * 60 * 1000));
  return format(localDate, 'yyyy-MM-dd HH:mm:ss');
}
