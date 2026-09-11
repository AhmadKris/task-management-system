import { api } from '@/lib/apiClient';

export async function fetchTasks(params) {
  // buang key kosong biar URL bersih
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null));
  const { data } = await api.get('/tasks', { params: clean });
  return data;
}

export async function createTask(payload) {
  const { data } = await api.post('/tasks', payload);
  return data.task;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/tasks/${id}`, payload);
  return data.task;
}

export async function deleteTask(id) {
  await api.delete(`/tasks/${id}`);
}
