import { Router } from 'express';
import { getUserProfile, getUserProfileById } from '../controllers/userController';

const router = Router();

// Perfil público por username
router.get('/:username', getUserProfile);

// Perfil por id (opcional)
router.get('/id/:id', getUserProfileById);

export default router;
