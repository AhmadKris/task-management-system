import { useState } from 'react';
import { ClipboardList, Plus, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { useTasks } from './useTasks';
import { useTaskMutations } from './useTaskMutations';
import { FilterBar } from './FilterBar';
import { TaskTable } from './TaskTable';
import { TaskCardList } from './TaskCardList';
import { TaskDialog } from './TaskDialog';
import { DeleteTaskDialog } from './DeleteTaskDialog';
import { TaskListSkeleton } from './TaskListSkeleton';

export function TasksPage() {
  const { filters, setFilter, resetFilters, tasks, meta, isLoading, isError, isFetching, refetch } =
    useTasks();
  const { changeStatus, remove } = useTaskMutations();

  const [dialogTask, setDialogTask] = useState(undefined); // undefined = tertutup, null = tambah, obj = edit
  const [toDelete, setToDelete] = useState(null);

  const hasFilter = filters.status || filters.search;

  function handleDelete(task) {
    remove.mutate(task.id, { onSuccess: () => setToDelete(null) });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Tugas saya</h1>
          <p className="text-sm text-muted-foreground">
            {meta ? `${meta.total} tugas total` : 'Memuat...'}
          </p>
        </div>
        <Button onClick={() => setDialogTask(null)}>
          <Plus /> Tambah tugas
        </Button>
      </div>

      <FilterBar filters={filters} onChange={setFilter} />

      {isLoading ? (
        <TaskListSkeleton />
      ) : isError ? (
        <EmptyState
          icon={SearchX}
          title="Gagal memuat tugas"
          description="Periksa koneksi atau coba lagi sebentar."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Coba lagi
            </Button>
          }
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={hasFilter ? SearchX : ClipboardList}
          title={hasFilter ? 'Tidak ada tugas yang cocok' : 'Belum ada tugas'}
          description={
            hasFilter
              ? 'Coba ubah kata kunci atau filter status.'
              : 'Mulai dengan menambahkan tugas pertama kamu.'
          }
          action={
            hasFilter ? (
              <Button variant="outline" onClick={resetFilters}>
                Reset filter
              </Button>
            ) : (
              <Button onClick={() => setDialogTask(null)}>
                <Plus /> Tambah tugas
              </Button>
            )
          }
        />
      ) : (
        <div className={isFetching ? 'opacity-60 transition-opacity' : undefined}>
          <TaskTable
            tasks={tasks}
            onEdit={setDialogTask}
            onDelete={setToDelete}
            onChangeStatus={(task, status) => changeStatus.mutate({ id: task.id, status })}
          />
          <TaskCardList
            tasks={tasks}
            onEdit={setDialogTask}
            onDelete={setToDelete}
            onChangeStatus={(task, status) => changeStatus.mutate({ id: task.id, status })}
          />
          <div className="mt-4">
            <Pagination meta={meta} onPageChange={(page) => setFilter({ page })} />
          </div>
        </div>
      )}

      <TaskDialog
        open={dialogTask !== undefined}
        onOpenChange={(open) => !open && setDialogTask(undefined)}
        task={dialogTask || undefined}
      />
      <DeleteTaskDialog
        task={toDelete}
        onOpenChange={setToDelete}
        onConfirm={handleDelete}
        pending={remove.isPending}
      />
    </div>
  );
}
