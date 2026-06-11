import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  owner: mongoose.Types.ObjectId;
  type: 'url' | 'file' | 'code';
  input: string;
  image?: string;
  status: 'pending' | 'analyzed' | 'failed';
  accessibilityScore?: number;
  likes: mongoose.Types.ObjectId[];
  isHidden?: boolean;
  hiddenAt?: Date;
  hiddenReason?: string;
  isFeatured?: boolean;
  featuredAt?: Date;
  tags?: string[];
  category?: string;
  
  // --- SISTEMA DE VOTACIÓN ---
  ratings: { user: mongoose.Types.ObjectId; value: number }[]; // Array con quién votó y cuánto
  averageRating: number; // La nota media calculada (ej: 4.5)
  
  createdAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    // Referencia al usuario que creó el proyecto (clave foránea en NoSQL)
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // Tres tipos de entrada: URL (se captura con Puppeteer), file (imagen/PDF), code (HTML/CSS/JS)
    type: { type: String, enum: ['url', 'file', 'code'], required: true },
    // URL, nombre de archivo o contenido según el tipo
    input: { type: String, required: true },
    // Captura de pantalla o portada del proyecto (nombre del archivo en /uploads)
    image: { type: String },
    // pending = recién creado, analyzed = IA completada, failed = error en análisis
    status: { type: String, enum: ['pending', 'analyzed', 'failed'], default: 'pending' },
    // Puntuación de accesibilidad 0-100 (calculada por Gemini + heurísticas)
    accessibilityScore: { type: Number, min: 0, max: 100 },

    // Control de visibilidad por moderación (admin)
    isHidden: { type: Boolean, default: false },
    hiddenAt: { type: Date },
    hiddenReason: { type: String, trim: true },
    // Destacado por admin en la comunidad
    isFeatured: { type: Boolean, default: false },
    featuredAt: { type: Date },
    tags: [{ type: String, trim: true }],
    category: { type: String, trim: true },
    
    // Likes: array de ObjectIds de usuarios. Almacenado embebido en vez de colección separada
    // porque siempre se consulta junto al proyecto (evita joins en MongoDB)
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    // Votaciones 1-5 estrellas: quién votó y qué puntuación dio.
    // El backend recalcula averageRating tras cada voto.
    ratings: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      value: { type: Number, min: 1, max: 5 }
    }],
    averageRating: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IProject>('Project', ProjectSchema);