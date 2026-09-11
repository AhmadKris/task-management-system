import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setAccessToken, setOnAuthLost } from '@/lib/apiClient';
import * as authApi from './authApi';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | anonymous
  const queryClient = useQueryClient();

  const applySession = useCallback((data) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
    setStatus('authenticated');
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus('anonymous');
    queryClient.clear();
  }, [queryClient]);

  useEffect(() => {
    setOnAuthLost(clearSession);
  }, [clearSession]);

  // coba pulihkan sesi dari cookie refresh sekali di awal
  useEffect(() => {
    let active = true;
    authApi
      .restoreSession()
      .then((data) => {
        if (active) applySession(data);
      })
      .catch(() => {
        if (active) setStatus('anonymous');
      });
    return () => {
      active = false;
    };
  }, [applySession]);

  const value = {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    async login(payload) {
      applySession(await authApi.login(payload));
    },
    async register(payload) {
      applySession(await authApi.register(payload));
    },
    async logout() {
      try {
        await authApi.logout();
      } finally {
        clearSession();
      }
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}
