import { AuthContext } from './AuthProvider';

// helper khusus test: inject nilai auth tanpa jaringan
export function AuthContextStub({ value, children }) {
  const full = {
    user: null,
    status: 'anonymous',
    isAuthenticated: value?.status === 'authenticated',
    login: async () => {},
    register: async () => {},
    logout: async () => {},
    ...value,
  };
  return <AuthContext.Provider value={full}>{children}</AuthContext.Provider>;
}
