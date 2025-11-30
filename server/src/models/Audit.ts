import mongoose, { Schema, Document } from 'mongoose';

export interface IAudit extends Document {
  score: number;
  issues: any[]; 
  rawResponse?: string; 
  project?: mongoose.Types.ObjectId; // <--- CAMPO FALTANTE EN LA INTERFAZ
  createdAt: Date;
}

const AuditSchema: Schema = new Schema(
  {
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    issues: [
      {
        element: String,
        problem: String,
        suggestion: String,
        severity: String 
      }
    ],
    rawResponse: String,
    
    // --- CAMPO FALTANTE EN EL ESQUEMA ---
    // Sin esto, Mongoose ignora el ID del proyecto al guardar
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAudit>('Audit', AuditSchema);