import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authClient } from '../services/authClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const profile = await authClient.me();
        setUser(profile);
      } catch {
        authClient.clearSession();
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const profile = await authClient.login(email, password);
    setUser(profile);
    return profile;
  };

  const logout = async () => {
    await authClient.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isInitializing,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, isInitializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}
