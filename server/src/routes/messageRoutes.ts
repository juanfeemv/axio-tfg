import { Router } from 'express';
import { protect } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import {
  listConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
  markConversationRead,
  deleteConversation
} from '../controllers/messageController';

const router = Router();

router.use(protect);

router.get('/conversations', listConversations);
router.post('/conversations', getOrCreateConversation);
router.get('/:conversationId', getConversationMessages);
router.post('/:conversationId', upload.single('image'), sendMessage);
router.post('/:conversationId/read', markConversationRead);
router.delete('/:conversationId', deleteConversation);

export default router;
