import { api } from '@/lib/apiClient';

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data;
}

export async function login(payload) {
  const { data } = await api.post('/auth/login', payload);
  return data;
}

export async function logout() {
  await api.post('/auth/logout');
}

// dipakai saat aplikasi pertama dibuka: kalau masih ada cookie refresh yang valid,
// kita dapat access token baru tanpa user perlu login ulang
export async function restoreSession() {
  const { data } = await api.post('/auth/refresh', null, { _skipAuthRefresh: true });
  return data;
}
