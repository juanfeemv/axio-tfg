import mongoose, { Schema, Document } from 'mongoose';

export interface IAudit extends Document {
  score: number;
  issues: any[]; // Array con los errores
  rawResponse?: string; // Por si acaso guardamos el texto crudo
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
        severity: String // 'high', 'medium', 'low'
      }
    ],
    rawResponse: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAudit>('Audit', AuditSchema);