import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
    user: mongoose.Types.ObjectId; // Referencia al User
    permissions: {
        manageUsers: boolean;
        manageProjects: boolean;
        manageAudits: boolean;
        managePins: boolean;
        viewStats: boolean;
    };
    activityLog: {
        action: string;
        targetType: 'user' | 'project' | 'audit' | 'pin';
        targetId?: mongoose.Types.ObjectId;
        timestamp: Date;
        details?: string;
    }[];
    createdBy?: mongoose.Types.ObjectId; // Qué admin creó este admin
    isActive: boolean;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true // Un usuario solo puede tener un registro de admin
        },
        permissions: {
            manageUsers: { type: Boolean, default: true },
            manageProjects: { type: Boolean, default: true },
            manageAudits: { type: Boolean, default: true },
            managePins: { type: Boolean, default: true },
            viewStats: { type: Boolean, default: true }
        },
        activityLog: [{
            action: {
                type: String,
                required: true,
                enum: ['create', 'update', 'delete', 'view', 'export']
            },
            targetType: {
                type: String,
                enum: ['user', 'project', 'audit', 'pin'],
                required: true
            },
            targetId: {
                type: Schema.Types.ObjectId
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            details: String
        }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

AdminSchema.index({ isActive: 1 });

// Método para registrar actividad
AdminSchema.methods.logActivity = function (
    action: string,
    targetType: string,
    targetId?: mongoose.Types.ObjectId,
    details?: string
) {
    this.activityLog.push({
        action,
        targetType,
        targetId,
        timestamp: new Date(),
        details
    });

    // Mantener solo los últimos 100 logs para no crecer indefinidamente
    if (this.activityLog.length > 100) {
        this.activityLog = this.activityLog.slice(-100);
    }

    return this.save();
};

// Método estático para verificar si un usuario es admin activo
AdminSchema.statics.isActiveAdmin = async function (userId: mongoose.Types.ObjectId) {
    const admin = await this.findOne({ user: userId, isActive: true });
    return !!admin;
};

// Método estático para obtener permisos de un admin
AdminSchema.statics.getPermissions = async function (userId: mongoose.Types.ObjectId) {
    const admin = await this.findOne({ user: userId, isActive: true });
    return admin?.permissions || null;
};

export default mongoose.model<IAdmin>('Admin', AdminSchema);
