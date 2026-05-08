import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: 'dm' | 'pin';
  title: string;
  body?: string;
  data?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['dm', 'pin'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    body: {
      type: String,
      trim: true
    },
    data: {
      type: Schema.Types.Mixed
    },
    readAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

NotificationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
