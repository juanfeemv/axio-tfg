import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  recipient: mongoose.Types.ObjectId;
  text: string;
  image?: string;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    readAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

MessageSchema.index({ conversation: 1, createdAt: 1 });

// Requiere texto o imagen
MessageSchema.pre('validate', function (next) {
  const hasText = typeof this.text === 'string' && this.text.trim().length > 0;
  const hasImage = typeof this.image === 'string' && this.image.trim().length > 0;
  if (!hasText && !hasImage) {
    return next(new Error('Message requires text or image'));
  }
  next();
});

export default mongoose.model<IMessage>('Message', MessageSchema);
