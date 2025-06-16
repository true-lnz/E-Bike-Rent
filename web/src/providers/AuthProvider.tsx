// src/auth/context/AuthProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { getMe } from '../services/authService';
import type { User } from '../types/user';

interface AuthContextProps {
  email: string;
  setEmail: (e: string) => void;
  isVerified: boolean;
  setIsVerified: (v: boolean) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{
      email, setEmail, isVerified, setIsVerified, user, setUser, isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
