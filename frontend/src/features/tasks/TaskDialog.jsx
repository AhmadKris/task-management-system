import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/Field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STATUS_OPTIONS } from './taskConstants';
import { taskSchema, taskToForm, formToPayload } from './taskSchema';
import { useTaskMutations } from './useTaskMutations';

export function TaskDialog({ open, onOpenChange, task }) {
  const isEdit = Boolean(task);
  const { create, update } = useTaskMutations();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(taskSchema), defaultValues: taskToForm(task) });

  // isi ulang form tiap dialog dibuka / task berganti
  useEffect(() => {
    if (open) reset(taskToForm(task));
  }, [open, task, reset]);

  async function onSubmit(values) {
    const payload = formToPayload(values);
    try {
      if (isEdit) {
        await update.mutateAsync({ id: task.id, data: payload });
      } else {
        await create.mutateAsync(payload);
      }
      onOpenChange(false);
    } catch {
      // pesan error sudah ditangani lewat toast di useTaskMutations
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit tugas' : 'Tugas baru'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Perbarui detail tugas.' : 'Isi detail tugas yang mau kamu catat.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Field label="Judul" htmlFor="title" error={errors.title?.message}>
            <Input id="title" autoFocus {...register('title')} />
          </Field>

          <Field label="Deskripsi" htmlFor="description" error={errors.description?.message}>
            <Textarea id="description" rows={3} {...register('description')} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status" error={errors.status?.message}>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            <Field label="Deadline" htmlFor="deadline" error={errors.deadline?.message}>
              <Input id="deadline" type="date" {...register('deadline')} />
            </Field>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Batal
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
