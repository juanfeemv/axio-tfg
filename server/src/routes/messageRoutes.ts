import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import {
  listConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage,
  markConversationRead,
  deleteConversation
} from '../controllers/messageController.js';

const router = Router();

router.use(protect);

router.get('/conversations', listConversations);
router.post('/conversations', getOrCreateConversation);
router.get('/:conversationId', getConversationMessages);
router.post('/:conversationId', upload.single('image'), sendMessage);
router.post('/:conversationId/read', markConversationRead);
router.delete('/:conversationId', deleteConversation);

export default router;
