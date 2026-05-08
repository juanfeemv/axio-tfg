import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Conecto con el servidor
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:3000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // 1. Crear la conexión al arrancar la web
    const newSocket = io(SOCKET_URL);

    newSocket.on('connect', () => {
      console.log("🟢 Conectado al servidor de WebSockets");
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log("🔴 Desconectado de WebSockets");
      setIsConnected(false);
    });

    setSocket(newSocket);

    // 2. Limpieza al cerrar la web
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (!socket || !user?.id) return;
    socket.emit('join_user', user.id);
  }, [socket, user?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}; 


export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket debe usarse dentro de SocketProvider');
  return context;
};