import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, pass: string) => Promise<void>;
  updateUser: (userData: User) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Al iniciar, recuperar estado de autenticación de localStorage (persiste entre recargas)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isAdmin = user?.role === 'admin';

  // Sincronizar estado al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error recuperando usuario");
      }
    }
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      // POST /api/auth/login → backend verifica credenciales, devuelve JWT + datos usuario
      const res = await api.post('/auth/login', {
        email,
        password: pass
      });

      const { token, user } = res.data;

      // Guardar token y datos en localStorage para persistencia
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);

      // Redirigir al dashboard (SPA: window.location recarga con la ruta correcta)
      window.location.href = '/dashboard';
    } catch (error) {
      console.error("Error login:", error);
      throw error;
    }
  };

  const logout = () => {
    // Limpiar todo: token, datos, sesión → redirigir a login
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const register = async (username: string, email: string, pass: string) => {
    try {
      await api.post('/auth/register', {
        username,
        email,
        password: pass
      });
    } catch (error) {
      console.error("Error registro:", error);
      throw error;
    }
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const forgotPassword = async (email: string) => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error("Error forgot password:", error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await api.post(`/auth/reset-password/${token}`, {
        newPassword
      });
    } catch (error) {
      console.error("Error reset password:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isAdmin,
      login,
      logout,
      register,
      updateUser,
      forgotPassword,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};