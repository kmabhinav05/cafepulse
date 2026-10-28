import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { firebaseAuthService } from '../services/firebaseServices';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cafepulse_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cafepulse_access_token'));
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(async () => {
    await firebaseAuthService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userData = await firebaseAuthService.login(email, password);
      setUser(userData);
      setToken(localStorage.getItem('cafepulse_access_token'));
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin,
        isStaff,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
