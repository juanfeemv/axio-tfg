import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';

// --- CONFIGURACIÓN ---
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

// --- RUTA DE PRUEBA ---
// Fíjate aquí: añadimos :Request y :Response para que TS nos ayude
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'online',
    project: 'Axio API (TypeScript)',
    version: '1.0.0' 
  });
});

// --- CONEXIÓN BASE DE DATOS ---
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || ''; // TS nos obliga a asegurar que existe
    if (!mongoURI) {
        throw new Error("MONGO_URI no está definido en el .env");
    }
    await mongoose.connect(mongoURI);
    console.log('🟢 MongoDB conectado correctamente');
  } catch (error: any) {
    console.log('🔴 Error conectando a MongoDB');
    console.log('   Mensaje:', error.message);
  }
};

// --- ARRANCAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor AXIO (TS) escuchando en http://localhost:${PORT}`);
  connectDB();
});