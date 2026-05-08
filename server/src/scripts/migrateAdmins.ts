/**
 * Script de migración para crear registros Admin para usuarios existentes con role='admin'
 * Run with: npm run migrate-admins
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

async function migrateAdmins() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('✅ Conectado a MongoDB\n');

        // Buscar todos los usuarios con role='admin'
        const adminUsers = await User.find({ role: 'admin' });
        console.log(`📊 Encontrados ${adminUsers.length} usuarios admin\n`);

        if (adminUsers.length === 0) {
            console.log('No hay usuarios admin para migrar');
            process.exit(0);
        }

        let created = 0;
        let existing = 0;

        for (const user of adminUsers) {
            // Verificar si ya existe un registro Admin
            const adminExists = await Admin.findOne({ user: user._id });

            if (adminExists) {
                console.log(`⏭️  Admin ya existe para: ${user.username} (${user.email})`);
                existing++;
                continue;
            }

            // Crear nuevo registro Admin
            const newAdmin = new Admin({
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

            await newAdmin.save();
            console.log(`✅ Creado registro Admin para: ${user.username} (${user.email})`);
            created++;
        }

        console.log(`\n📈 Resultado:`);
        console.log(`   - Creados: ${created}`);
        console.log(`   - Ya existían: ${existing}`);
        console.log(`   - Total: ${adminUsers.length}\n`);

        console.log('✨ Migración completada exitosamente');

    } catch (error) {
        console.error('❌ Error en la migración:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
        process.exit(0);
    }
}

migrateAdmins();
