import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // CORRECCIÓN: Leemos el localStorage DENTRO del useState.
  // Así, el valor inicial es 'true' antes de que se pinte nada en pantalla.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });
  
  const [user, setUser] = useState<User | null>(null);

  // Opcional: Recuperar datos del usuario al recargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user'); // Si guardaras el usuario también
    
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
      const res = await axios.post('http://localhost:3000/api/auth/login', { 
        email, 
        password: pass 
      });
      
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      // Guardamos también datos básicos del usuario para no perder el nombre al recargar
      localStorage.setItem('user', JSON.stringify(user)); 
      
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (username: string, email: string, pass: string) => {
    try {
      await axios.post('http://localhost:3000/api/auth/register', { 
        username, 
        email, 
        password: pass 
      });
    } catch (error) {
      console.error("Error registro:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};