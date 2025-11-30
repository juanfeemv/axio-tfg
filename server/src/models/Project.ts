import mongoose, { Schema, Document } from 'mongoose';

// 1. Interfaz TypeScript 
export interface IProject extends Document {
  title: string;
  owner: mongoose.Types.ObjectId; // Referencia al ID del usuario
  type: 'url' | 'file';
  input: string; // La URL (https://...) o la ruta del archivo (uploads/foto.png)
  status: 'pending' | 'analyzed' | 'failed';
  accessibilityScore?: number; // Opcional, solo si ya se analizó
  createdAt: Date;
}

// 2. Esquema Mongoose (La estructura en BD)
const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'El título del proyecto es obligatorio'],
      trim: true
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Esto conecta con el modelo User
      required: true
    },
    type: {
      type: String,
      enum: ['url', 'file', 'code'],
      required: true
    },
    input: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'analyzed', 'failed'],
      default: 'pending'
    },
    accessibilityScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IProject>('Project', ProjectSchema);