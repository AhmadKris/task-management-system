import { format, isValid, parseISO, isPast, isToday } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(value) {
  if (!value) return null;
  const date = typeof value === 'string' ? parseISO(value) : value;
  return isValid(date) ? format(date, 'd MMM yyyy', { locale: id }) : null;
}

// deadline lewat = merah, hari ini = oranye
export function deadlineTone(value) {
  if (!value) return 'muted';
  const date = parseISO(value);
  if (!isValid(date)) return 'muted';
  if (isToday(date)) return 'warning';
  return isPast(date) ? 'overdue' : 'normal';
}
