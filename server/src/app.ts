import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http'; // <--- NUEVO
import { Server } from 'socket.io';  // <--- NUEVO

// Rutas
import authRoutes from './routes/authRoutes';
import analyzeRoutes from './routes/analyzeRoutes';
import projectRoutes from './routes/projectRoutes';
import pinRoutes from './routes/pinRoutes';

// --- CONFIGURACIÓN ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log("\n🔵 [DEBUG] Iniciando app.ts...");

const app = express();
const PORT = process.env.PORT || 3000;

// --- CREAMOS EL SERVIDOR HTTP Y SOCKET.IO ---
// Express gestiona las rutas normales, httpServer gestiona la conexión real
const httpServer = createServer(app); 
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Permitimos conexiones desde cualquier frontend (para evitar líos de CORS en dev)
    methods: ["GET", "POST"]
  }
});

// --- LÓGICA DE TIEMPO REAL (SOCKETS) ---
io.on('connection', (socket) => {
  console.log('🔌 Nuevo cliente conectado por Socket:', socket.id);

  // 1. Unirse a la sala de un proyecto
  // Cuando entras a ver un proyecto, te "suscribes" a sus cambios
  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`👥 Usuario unido a la sala del proyecto: ${projectId}`);
  });

  // 2. Alguien pone un Pin
  socket.on('send_pin', (data) => {
    // data trae: { projectId, pin }
    // Rebotamos el pin a TODOS los que estén viendo ese proyecto
    io.to(data.projectId).emit('new_pin', data.pin);
    console.log(`📍 Nuevo Pin en proyecto ${data.projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado');
  });
});

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- RUTAS API ---
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/pins', pinRoutes);

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'online', mode: 'real-time' });
});

// --- CONEXIÓN BD Y ARRANQUE ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '');
    console.log('🟢 [ÉXITO] MongoDB conectado');
  } catch (error: any) {
    console.log('🔴 [ERROR] Fallo al conectar a MongoDB:', error.message);
  }
};

// ¡IMPORTANTE! Usamos httpServer.listen, NO app.listen
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Servidor AXIO (Sockets + API) escuchando en http://localhost:${PORT}`);
  connectDB();
});