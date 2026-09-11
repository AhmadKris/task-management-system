import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiErrorMessage } from '@/lib/apiClient';
import { createTask, deleteTask, updateTask } from './tasksApi';

export function useTaskMutations() {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['tasks'] });

  const create = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast.success('Tugas ditambahkan');
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err, 'Gagal menambah tugas')),
  });

  const update = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      toast.success('Perubahan disimpan');
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err, 'Gagal menyimpan perubahan')),
  });

  // update status langsung dari daftar - optimistic biar kerasa instan
  const changeStatus = useMutation({
    mutationFn: ({ id, status }) => updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['tasks'] });
      const snapshots = qc.getQueriesData({ queryKey: ['tasks'] });
      snapshots.forEach(([key, value]) => {
        if (!value?.data) return;
        qc.setQueryData(key, {
          ...value,
          data: value.data.map((t) => (t.id === id ? { ...t, status } : t)),
        });
      });
      return { snapshots };
    },
    onError: (err, _vars, ctx) => {
      ctx?.snapshots?.forEach(([key, value]) => qc.setQueryData(key, value));
      toast.error(apiErrorMessage(err, 'Gagal mengubah status'));
    },
    onSettled: invalidate,
  });

  const remove = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success('Tugas dihapus');
      invalidate();
    },
    onError: (err) => toast.error(apiErrorMessage(err, 'Gagal menghapus tugas')),
  });

  return { create, update, changeStatus, remove };
}
