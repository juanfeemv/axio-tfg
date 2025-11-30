import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const viewDatabase = async () => {
  try {
    // Intentamos conectar a la misma URI que usa tu aplicación
    // Nota: Si usas Docker, 127.0.0.1 suele ser más fiable que localhost
    const envUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/axio_db";
    console.log(`🔌 Conectando el VISOR a: ${envUri}`);
    
    await mongoose.connect(envUri);
    console.log('✅ Conexión establecida.');

    // 1. Listar Colecciones (Tablas)
    const collections = await mongoose.connection.db!.listCollections().toArray();
    console.log('\n📚 COLECCIONES ENCONTRADAS:');
    if (collections.length === 0) {
        console.log("   (Ninguna. La base de datos está vacía)");
    } else {
        collections.forEach(c => console.log(`   - 📁 ${c.name}`));
    }

    // 2. Ver Usuarios Reales
    console.log('\n👤 USUARIOS REGISTRADOS:');
    // AÑADIDO: .select('+password') fuerza a Mongo a traer el campo oculto
    const users = await User.find({}).select('+password');
    
    if (users.length === 0) {
        console.log("   (No hay usuarios todavía)");
    } else {
        users.forEach((u: any) => {
            console.log(`   -------------------------------------------`);
            console.log(`   🆔 ID:       ${u._id}`);
            console.log(`   👤 Nombre:   ${u.username}`);
            console.log(`   📧 Email:    ${u.email}`);
            // AÑADIDO: Comprobación de seguridad con ?
            const passDisplay = u.password ? u.password.substring(0, 15) : "******** (No disponible)";
            console.log(`   🔑 Password: ${passDisplay}... (Encriptada)`);
            console.log(`   📅 Creado:   ${u.createdAt}`);
        });
        console.log(`   -------------------------------------------`);
        console.log(`   TOTAL: ${users.length} usuarios.`);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Visor desconectado.');
    process.exit();
  }
};

viewDatabase();