import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

// 1. Definimos la forma de los datos del usuario
interface User {
  id: string;
  username: string;
  email: string;
}

// 2. Definimos qué funciones y datos tendrá nuestro contexto
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  // AÑADIDO: Definimos que existe la función register
  register: (username: string, email: string, pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Al cargar la web, miramos si hay token guardado para mantener la sesión
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función LOGIN
  const login = async (email: string, pass: string) => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { 
        email, 
        password: pass 
      });
      
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error login:", error);
      throw error;
    }
  };

  // Función LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // AÑADIDO: Función REGISTER
  const register = async (username: string, email: string, pass: string) => {
    try {
      await axios.post('http://localhost:3000/api/auth/register', { 
        username, 
        email, 
        password: pass 
      });
      // No hacemos login automático, dejamos que vaya a la página de login
    } catch (error) {
      console.error("Error registro:", error);
      throw error;
    }
  };

  return (
    // AÑADIDO: Pasamos 'register' dentro del value para que se pueda usar fuera
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