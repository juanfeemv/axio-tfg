import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Rutas
import authRoutes from './routes/authRoutes';
import analyzeRoutes from './routes/analyzeRoutes';
import projectRoutes from './routes/projectRoutes';
import pinRoutes from './routes/pinRoutes';
import statsRoutes from './routes/statsRoutes';
import adminRoutes from './routes/adminRoutes';

// --- CONFIGURACIÓN ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log("\n🔵 [DEBUG] Iniciando app.ts...");

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*').split(',').map((o) => o.trim());

// --- CREAMOS EL SERVIDOR HTTP Y SOCKET.IO ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// --- LÓGICA DE TIEMPO REAL (SOCKETS) ---
io.on('connection', (socket) => {
  console.log('🔌 Nuevo cliente conectado por Socket:', socket.id);

  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`👥 Usuario unido a la sala del proyecto: ${projectId}`);
  });

  socket.on('send_pin', (data) => {
    io.to(data.projectId).emit('new_pin', data.pin);
    console.log(`📍 Nuevo Pin en proyecto ${data.projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado');
  });
});

// --- MIDDLEWARES ---
app.disable('x-powered-by');
// CORS permitido para cualquier origen en dev
app.use(cors({ origin: (origin, cb) => cb(null, origin || '*'), credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Cabeceras permisivas para TODAS las respuestas (incluye static y sockets)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
  res.setHeader('Content-Security-Policy', "");
  res.removeHeader('X-Frame-Options');
  res.removeHeader('Strict-Transport-Security');
  res.removeHeader('Origin-Agent-Cluster');
  next();
});

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- RUTAS API ---
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

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

httpServer.listen(PORT, () => {
  console.log(`\n🚀 Servidor AXIO (Sockets + API) escuchando en http://localhost:${PORT}`);
  connectDB();
});