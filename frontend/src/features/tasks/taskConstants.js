export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Belum dikerjakan' },
  { value: 'in-progress', label: 'Sedang dikerjakan' },
  { value: 'done', label: 'Selesai' },
];

export const STATUS_LABEL = Object.fromEntries(STATUS_OPTIONS.map((s) => [s.value, s.label]));

export const STATUS_BADGE = {
  pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'in-progress': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  done: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Terbaru dibuat' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'title', label: 'Judul (A-Z)' },
];
