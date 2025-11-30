import { Router } from 'express';
import { register, login, updateProfile, changePassword } from '../controllers/authController';
import { protect } from '../middlewares/auth'; // Necesitamos proteger estas rutas

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Rutas protegidas (necesitan token)
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;