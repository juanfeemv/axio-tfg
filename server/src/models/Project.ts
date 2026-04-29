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
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['url', 'file', 'code'], required: true },
    input: { type: String, required: true },
    image: { type: String },
    status: { type: String, enum: ['pending', 'analyzed', 'failed'], default: 'pending' },
    accessibilityScore: { type: Number, min: 0, max: 100 },

    isHidden: { type: Boolean, default: false },
    hiddenAt: { type: Date },
    hiddenReason: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    featuredAt: { type: Date },
    tags: [{ type: String, trim: true }],
    category: { type: String, trim: true },
    
    // Likes (Me gusta simples)
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    // --- VOTACIONES (Estrellas 1-5) ---
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