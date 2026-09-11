import { cn } from '@/lib/utils';
import { STATUS_BADGE, STATUS_LABEL } from './taskConstants';

export function StatusBadge({ status }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_BADGE[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
