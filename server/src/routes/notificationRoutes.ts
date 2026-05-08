import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { listNotifications, markAllRead, markNotificationRead } from '../controllers/notificationController.js';

const router = Router();

router.use(protect);

router.get('/', listNotifications);
router.post('/read-all', markAllRead);
router.post('/:id/read', markNotificationRead);

export default router;
