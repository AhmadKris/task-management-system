import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

let accessToken = null;
// dipanggil AuthProvider saat login/logout supaya token nggak nyangkut di module scope aja
export function setAccessToken(token) {
  accessToken = token;
}

// dipanggil kalau refresh gagal total -> AuthProvider akan bersihin state & lempar ke /login
let onAuthLost = () => {};
export function setOnAuthLost(fn) {
  onAuthLost = fn;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Kalau dapat 401 karena token expired, coba refresh sekali. Request paralel
// yang kena 401 barengan akan nunggu satu proses refresh yang sama.
let refreshing = null;

async function runRefresh() {
  const res = await api.post('/auth/refresh', null, { _skipAuthRefresh: true });
  return res.data.accessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (!response || response.status !== 401 || config._retry || config._skipAuthRefresh) {
      return Promise.reject(error);
    }
    const code = response.data?.code;
    if (code && code !== 'TOKEN_EXPIRED' && code !== 'UNAUTHORIZED') {
      return Promise.reject(error);
    }

    config._retry = true;
    try {
      refreshing = refreshing || runRefresh();
      const newToken = await refreshing;
      refreshing = null;
      accessToken = newToken;
      config.headers.Authorization = `Bearer ${newToken}`;
      return api(config);
    } catch (err) {
      refreshing = null;
      onAuthLost();
      return Promise.reject(err);
    }
  }
);

// helper buat ambil pesan error yang enak ditampilkan
export function apiErrorMessage(error, fallback = 'Terjadi kesalahan') {
  return error?.response?.data?.message || fallback;
}

export function apiFieldErrors(error) {
  return error?.response?.data?.errors || null;
}
