import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes';
import analyzeRoutes from './routes/analyzeRoutes';
import projectRoutes from './routes/projectRoutes'; // <--- AÑADE ESTA LÍNEA

// --- CONFIGURACIÓN Y DEBUG ---

// Recreamos __filename y __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Buscamos el archivo .env en la carpeta padre (server/)
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

console.log("\n🔵 [DEBUG] Iniciando app.ts...");
console.log("🔵 [DEBUG] Buscando archivo .env en:", envPath);
console.log("🔵 [DEBUG] Valor leído de MONGO_URI:", process.env.MONGO_URI ? process.env.MONGO_URI : "UNDEFINED (¡VACÍO!)");

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/projects', projectRoutes);

// --- RUTA DE PRUEBA ---
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    status: 'online',
    project: 'Axio API (TypeScript)',
    version: '1.0.0',
    db_status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// --- CONEXIÓN BASE DE DATOS ---
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || '';
    
    console.log("🔶 [DEBUG] Intentando conectar a Mongoose con:", mongoURI);
    
    if (!mongoURI) {
        throw new Error("MONGO_URI no está definido en el .env (Revisa el archivo server/.env)");
    }
    
    await mongoose.connect(mongoURI);
    console.log('🟢 [ÉXITO] MongoDB conectado correctamente');

    // --- DIAGNÓSTICO DE BASE DE DATOS (NUEVO) ---
    // Esto listará qué hay dentro de verdad
    if (mongoose.connection.db) {
        const dbName = mongoose.connection.db.databaseName;
        console.log(`📂 Base de datos seleccionada: ${dbName}`);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("📚 Colecciones encontradas en la BD:");
        if (collections.length > 0) {
            collections.forEach(col => console.log(`   - ${col.name}`));
        } else {
            console.log("   ⚠️  NO HAY COLECCIONES (La base de datos está vacía)");
        }
    }
    // ----------------------------------------------
    
  } catch (error: any) {
    console.log('🔴 [ERROR] Fallo al conectar a MongoDB');
    console.log('   Causa:', error.message);
  }
};

// --- ARRANCAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor AXIO (TS) escuchando en http://localhost:${PORT}`);
  connectDB();
});