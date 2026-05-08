import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middlewares/auth.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { getIo } from '../utils/socket.js';

const getOtherParticipant = (participants: mongoose.Types.ObjectId[], userId: string) => {
  const other = participants.find((p) => p.toString() !== userId);
  return other ? other.toString() : null;
};

// GET /api/messages/conversations
export const listConversations = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username avatar')
      .populate('lastMessage', 'text sender createdAt')
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    const result = conversations.map((conv) => {
      const participants = conv.participants as any[];
      const otherUser = participants.find((p) => p._id.toString() !== userId);
      return {
        id: conv._id,
        otherUser,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt || conv.updatedAt
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error listing conversations:', error);
    res.status(500).json({ message: 'Error al obtener conversaciones' });
  }
};

// POST /api/messages/conversations { username }
export const getOrCreateConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Falta username' });
    }

    const targetUser = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }).select('username avatar');
    if (!targetUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (targetUser._id.toString() === userId) {
      return res.status(400).json({ message: 'No puedes abrir un chat contigo mismo' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [userId, targetUser._id] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, targetUser._id]
      });
    }

    res.json({
      success: true,
      data: {
        id: conversation._id,
        otherUser: targetUser
      }
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Error al crear conversacion' });
  }
};

// GET /api/messages/:conversationId
export const getConversationMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversacion no encontrada' });
    }

    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({ message: 'No tienes acceso a esta conversacion' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username avatar')
      .populate('recipient', 'username avatar');

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error al obtener mensajes' });
  }
};

// POST /api/messages/:conversationId
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { text } = req.body;
    const imageFile = req.file;
    const trimmedText = text ? String(text).trim() : '';

    if (!trimmedText && !imageFile) {
      return res.status(400).json({ message: 'El mensaje esta vacio' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversacion no encontrada' });
    }

    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({ message: 'No tienes acceso a esta conversacion' });
    }

    const recipientId = getOtherParticipant(conversation.participants, userId);
    if (!recipientId) {
      return res.status(400).json({ message: 'No se encontro receptor' });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      recipient: recipientId,
      text: trimmedText,
      image: imageFile?.filename || ''
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      lastMessageAt: message.createdAt
    });

    const populated = await message.populate('sender', 'username avatar');

    const senderUsername = (populated.sender as any)?.username || 'Usuario';

    await Notification.create({
      user: recipientId,
      type: 'dm',
      title: `Nuevo mensaje de ${senderUsername}`,
      body: trimmedText ? trimmedText.slice(0, 80) : 'Imagen enviada',
      data: {
        conversationId,
        senderId: userId,
        senderUsername
      }
    });

    const io = getIo();
    if (io) {
      // Solo emitir al receptor; el emisor ya gestiona el mensaje por la respuesta HTTP
      io.to(`user:${recipientId}`).emit('new_dm', {
        conversationId,
        message: populated
      });
      io.to(`user:${recipientId}`).emit('notification', {
        type: 'dm',
        title: `Nuevo mensaje de ${senderUsername}`,
        body: trimmedText ? trimmedText.slice(0, 80) : 'Imagen enviada',
        data: { conversationId, senderId: userId, senderUsername },
        createdAt: new Date().toISOString()
      });
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error al enviar mensaje' });
  }
};

// POST /api/messages/:conversationId/read
export const markConversationRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversacion no encontrada' });
    }

    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({ message: 'No tienes acceso a esta conversacion' });
    }

    await Message.updateMany(
      { conversation: conversationId, recipient: userId, readAt: { $exists: false } },
      { $set: { readAt: new Date() } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking read:', error);
    res.status(500).json({ message: 'Error al marcar como leido' });
  }
};

// DELETE /api/messages/:conversationId
export const deleteConversation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversacion no encontrada' });
    }

    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({ message: 'No tienes acceso a esta conversacion' });
    }

    // Eliminar todos los mensajes y la conversacion
    await Message.deleteMany({ conversation: conversationId });
    await Conversation.findByIdAndDelete(conversationId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Error al eliminar la conversacion' });
  }
};
