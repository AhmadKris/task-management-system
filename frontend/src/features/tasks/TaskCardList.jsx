import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { formatDate, deadlineTone } from '@/lib/date';
import { StatusBadge } from './StatusBadge';
import { TaskActions } from './TaskActions';

const toneClass = {
  overdue: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-400',
  normal: 'text-muted-foreground',
  muted: 'text-muted-foreground',
};

// tampilan mobile
export function TaskCardList({ tasks, onEdit, onDelete, onChangeStatus }) {
  return (
    <div className="space-y-3 md:hidden">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-start justify-between gap-2">
            <button className="text-left font-medium" onClick={() => onEdit(task)}>
              {task.title}
            </button>
            <TaskActions
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onChangeStatus={onChangeStatus}
            />
          </div>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{task.description}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <StatusBadge status={task.status} />
            {task.deadline && (
              <span
                className={cn(
                  'flex items-center gap-1 text-xs',
                  toneClass[deadlineTone(task.deadline)]
                )}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(task.deadline)}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
