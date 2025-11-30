import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Conectamos con el servidor (puerto 3000)
const SOCKET_URL = 'http://localhost:3000';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}; // <--- ¡AQUÍ SE CIERRA EL COMPONENTE!


export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket debe usarse dentro de SocketProvider');
  return context;
};