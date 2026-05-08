/**
 * Script para convertir un usuario a admin
 * Ejecutar con: npx tsx src/scripts/createFirstAdmin.ts email@ejemplo.com
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

async function createFirstAdmin() {
    try {
        const email = process.argv[2];

        if (!email) {
            console.log('❌ Error: Debes proporcionar un email');
            console.log('Uso: npx tsx src/scripts/createFirstAdmin.ts tu-email@ejemplo.com');
            process.exit(1);
        }

        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('✅ Conectado a MongoDB\n');

        // Buscar el usuario
        const user = await User.findOne({ email: email.trim() });

        if (!user) {
            console.log(`\n❌ No se encontró ningún usuario con el email: ${email}`);
            console.log('💡 Crea el usuario primero usando el registro normal.\n');
            process.exit(1);
        }

        console.log(`\n👤 Usuario encontrado: ${user.username} (${user.email})`);
        console.log(`   Rol actual: ${user.role}`);

        // Actualizar a admin
        if (user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
            console.log('✅ Rol actualizado a "admin"');
        } else {
            console.log('ℹ️  El usuario ya es admin');
        }

        // Verificar/crear registro Admin
        let adminRecord = await Admin.findOne({ user: user._id });

        if (!adminRecord) {
            adminRecord = new Admin({
                user: user._id,
                permissions: {
                    manageUsers: true,
                    manageProjects: true,
                    manageAudits: true,
                    managePins: true,
                    viewStats: true
                },
                isActive: true
            });
            await adminRecord.save();
            console.log('✅ Registro Admin creado con todos los permisos');
        } else {
            if (!adminRecord.isActive) {
                adminRecord.isActive = true;
                await adminRecord.save();
                console.log('✅ Registro Admin reactivado');
            } else {
                console.log('ℹ️  Registro Admin ya existe y está activo');
            }
        }

        console.log('\n🎉 ¡Todo listo!');
        console.log('\n📝 Instrucciones:');
        console.log('1. Cierra sesión en la aplicación');
        console.log('2. IMPORTANTE: Limpia localStorage (F12 → Application → Storage → Clear)');
        console.log('3. Vuelve a loguearte con este email');
        console.log('4. Deberías ir automáticamente a /admin\n');

        console.log('📊 Datos del admin:');
        console.log(`   Email: ${user.email}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Admin Active: ${adminRecord.isActive}\n`);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
        process.exit(0);
    }
}

createFirstAdmin();
