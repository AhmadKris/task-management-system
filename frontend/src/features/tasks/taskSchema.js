import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Judul wajib diisi').max(255, 'Judul terlalu panjang'),
  description: z.string().trim().max(5000, 'Deskripsi terlalu panjang').optional(),
  status: z.enum(['pending', 'in-progress', 'done']),
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Tanggal tidak valid')
    .optional()
    .or(z.literal('')),
});

export const emptyTask = {
  title: '',
  description: '',
  status: 'pending',
  deadline: '',
};

// bentuk data dari API -> bentuk form
export function taskToForm(task) {
  if (!task) return emptyTask;
  return {
    title: task.title ?? '',
    description: task.description ?? '',
    status: task.status,
    deadline: task.deadline ?? '',
  };
}

// bentuk form -> payload API (string kosong jadi null)
export function formToPayload(values) {
  return {
    title: values.title.trim(),
    description: values.description?.trim() ? values.description.trim() : null,
    status: values.status,
    deadline: values.deadline || null,
  };
}
