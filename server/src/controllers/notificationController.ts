import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Notification from '../models/Notification';

// GET /api/notifications
export const listNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error loading notifications:', error);
    res.status(500).json({ message: 'Error al obtener notificaciones' });
  }
};

// POST /api/notifications/:id/read
export const markNotificationRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: { readAt: new Date() } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ message: 'Error al marcar notificacion' });
  }
};

// POST /api/notifications/read-all
export const markAllRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    await Notification.updateMany(
      { user: userId, readAt: { $exists: false } },
      { $set: { readAt: new Date() } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking all read:', error);
    res.status(500).json({ message: 'Error al marcar notificaciones' });
  }
};
