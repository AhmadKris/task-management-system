import { cn } from '@/lib/utils';
import { formatDate, deadlineTone } from '@/lib/date';
import { StatusBadge } from './StatusBadge';
import { TaskActions } from './TaskActions';

const toneClass = {
  overdue: 'text-destructive',
  warning: 'text-amber-600 dark:text-amber-400',
  normal: 'text-foreground',
  muted: 'text-muted-foreground',
};

// tampilan desktop
export function TaskTable({ tasks, onEdit, onDelete, onChangeStatus }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border md:block">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Judul</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
            <th className="w-12 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <button
                  className="text-left font-medium hover:underline"
                  onClick={() => onEdit(task)}
                >
                  {task.title}
                </button>
                {task.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {task.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={task.status} />
              </td>
              <td className={cn('px-4 py-3', toneClass[deadlineTone(task.deadline)])}>
                {formatDate(task.deadline) || '-'}
              </td>
              <td className="px-4 py-3 text-right">
                <TaskActions
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onChangeStatus={onChangeStatus}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
