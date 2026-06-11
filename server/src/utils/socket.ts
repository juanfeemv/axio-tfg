import type { Server } from 'socket.io';

// Patrón Singleton: una única instancia de Socket.IO compartida entre app.ts (inicialización)
// y los controladores HTTP (emisión de eventos a clientes). Sin esto, cada controlador
// necesitaría recibir io como parámetro — con getIo() lo obtienen directamente.

let io: Server | null = null;

// Se llama UNA vez en app.ts al crear el servidor Socket.IO
export const setIo = (server: Server) => {
  io = server;
};

// Los controladores llaman getIo() para emitir eventos como new_dm, notification, etc.
export const getIo = () => io;
