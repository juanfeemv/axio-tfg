import mongoose, { Schema, Document } from 'mongoose';

// 1. Interfaz de TypeScript
// Qué propiedades tiene un Usuario para que te autocomplete.
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatar?: string; // El ? significa que es opcional
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// 2. Esquema de Mongoose
// Le dice a la Base de Datos cómo guardar los datos y qué reglas validar.
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      trim: true, // Elimina espacios al principio y final
      minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true, // No puede haber dos usuarios con el mismo email
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor, usa un email válido'] // Regex simple de email
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false // Por seguridad, no devolver la contraseña en las consultas por defecto
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true // Crea automáticamente createdAt y updatedAt
  }
);

// 3. Exportar el Modelo
export default mongoose.model<IUser>('User', UserSchema);