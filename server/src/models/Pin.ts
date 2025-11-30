import mongoose, { Schema, Document } from 'mongoose';

export interface IPin extends Document {
  project: mongoose.Types.ObjectId; // A qué proyecto pertenece
  author: mongoose.Types.ObjectId;  // Quién lo escribió
  x: number;       // Posición horizontal en % (0-100)
  y: number;       // Posición vertical en % (0-100)
  content: string; // El comentario
  createdAt: Date;
}

const PinSchema: Schema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPin>('Pin', PinSchema);