import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Conecto con el servidor usando el origen actual por defecto.
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL?.trim();

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Cloudflare Tunnel no soporta WebSocket nativo → forzamos polling HTTP.
    // Socket.IO polling funciona sobre HTTP normal, compatible con cloudflared.
    const opts = {
      transports: ['polling'] as ['polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    };
    const newSocket = SOCKET_URL ? io(SOCKET_URL, opts) : io(opts);

    newSocket.on('connect', () => {
      console.log("🟢 Conectado al servidor de WebSockets:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log("🔴 Desconectado de WebSockets");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Unirse a la sala del usuario cuando hay socket Y usuario.
  // Se ejecuta también al reconectar (socket cambia de id tras reconexión).
  useEffect(() => {
    if (!socket || !user?.id) return;

    const joinRoom = () => {
      socket.emit('join_user', user.id);
      console.log("🏠 Unido a sala privada del usuario:", user.id);
    };

    // Unirse al conectar por primera vez
    if (socket.connected) {
      joinRoom();
    }

    // Volver a unirse cada vez que se reconecte (cloudflared puede cortar el WS)
    socket.on('connect', joinRoom);

    return () => {
      socket.off('connect', joinRoom);
    };
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