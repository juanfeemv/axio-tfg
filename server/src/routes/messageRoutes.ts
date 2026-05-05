import { Router } from 'express';
import { protect } from '../middlewares/auth';
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
router.post('/:conversationId', sendMessage);
router.post('/:conversationId/read', markConversationRead);
router.delete('/:conversationId', deleteConversation);

export default router;
