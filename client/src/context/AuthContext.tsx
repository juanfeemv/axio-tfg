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
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });
  
  const [user, setUser] = useState<User | null>(() => {
    // Recupero el usuario al iniciar
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Efecto opcional para sincronizar
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
      const res = await axios.post('http://localhost:3000/api/auth/login', { 
        email, 
        password: pass 
      });
      
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
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
    sessionStorage.clear(); // LIMPIA TODO el sessionStorage
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login'; // Redirige con recarga completa
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

  // Actualiza el estado local del usuario (usada en Settings)
  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};