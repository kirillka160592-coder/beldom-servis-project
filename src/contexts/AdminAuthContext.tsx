import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, getToken, setToken, clearToken } from '@/lib/api';

type AdminAuthContextValue = {
  login: string | null;
  loading: boolean;
  signIn: (login: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [login, setLogin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((res) => setLogin(res.login))
      .catch(() => {
        clearToken();
        setLogin(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (loginValue: string, password: string) => {
    const res = await authApi.login(loginValue, password);
    setToken(res.token);
    setLogin(res.login);
  };

  const signOut = () => {
    authApi.logout().catch(() => {});
    clearToken();
    setLogin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ login, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth должен использоваться внутри AdminAuthProvider');
  return ctx;
}
