import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true,
      validate: {
        validator: (val: mongoose.Types.ObjectId[]) => val.length === 2,
        message: 'Una conversacion debe tener exactamente 2 participantes'
      }
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    },
    lastMessageAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

ConversationSchema.index({ participants: 1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
