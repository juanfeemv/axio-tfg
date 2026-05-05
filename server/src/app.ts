import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import { setIo } from './utils/socket';

// Rutas
import authRoutes from './routes/authRoutes';
import analyzeRoutes from './routes/analyzeRoutes';
import projectRoutes from './routes/projectRoutes';
import pinRoutes from './routes/pinRoutes';
import statsRoutes from './routes/statsRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';
import notificationRoutes from './routes/notificationRoutes';

// --- CONFIGURACIÓN ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log("\n🔵 [DEBUG] Iniciando app.ts...");

const app = express();
const PORT = process.env.PORT || 3000;
const rawOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
const allowedOrigins = rawOrigins.length ? rawOrigins : ['http://localhost:5173'];
const allowAnyOrigin = allowedOrigins.includes('*');
const corsOrigin = (origin: string | undefined, cb: (err: Error | null, allow?: boolean | string) => void) => {
  if (!origin || allowAnyOrigin) return cb(null, true);
  return cb(null, allowedOrigins.includes(origin));
};
const cspFrameAncestors = allowAnyOrigin ? ['*'] : ["'self'", ...allowedOrigins];

// --- CREAMOS EL SERVIDOR HTTP Y SOCKET.IO ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: !allowAnyOrigin
  }
});
setIo(io);

// --- LÓGICA DE TIEMPO REAL (SOCKETS) ---
io.on('connection', (socket) => {
  console.log('🔌 Nuevo cliente conectado por Socket:', socket.id);

  socket.on('join_user', (userId) => {
    if (!userId) return;
    socket.join(`user:${userId}`);
    console.log(`💬 Usuario unido a su sala privada: ${userId}`);
  });

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
// CORS controlado por lista de orígenes permitidos
app.use(cors({
  origin: corsOrigin,
  credentials: !allowAnyOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      frameAncestors: cspFrameAncestors,
      formAction: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(express.json({ limit: '1mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (/\.(html?|js|mjs|cjs|jsx|ts|tsx|json|css)$/i.test(filePath)) {
      res.setHeader('Content-Disposition', 'attachment');
    }
  }
}));

// --- RUTAS API ---
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/pins', pinRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

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