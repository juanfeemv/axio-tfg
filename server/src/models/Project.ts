import mongoose, { Schema, Document } from 'mongoose';

// 1. Interfaz TypeScript
export interface IProject extends Document {
  title: string;
  owner: mongoose.Types.ObjectId; // Referencia al ID del usuario
  type: 'url' | 'file' | 'code'; // He añadido 'code' aquí para que no te de error con lo nuevo
  input: string; // La URL o el nombre original del archivo
  image?: string; // <--- NUEVO: Campo opcional para la ruta de la imagen/captura
  status: 'pending' | 'analyzed' | 'failed';
  accessibilityScore?: number;
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
      ref: 'User',
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
    image: { // <--- NUEVO: Aquí se guardará "uploads/foto.png"
      type: String
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