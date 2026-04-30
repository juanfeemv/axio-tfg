import { Router } from 'express';
import { 
  register, 
  login, 
  updateProfile, 
  changePassword, 
  deleteUser,
  forgotPassword,    
  resetPassword,
  uploadAvatar      
} from '../controllers/authController'; 
import { protect } from '../middlewares/auth';
import { upload } from '../middlewares/upload';
import { rateLimit } from '../middlewares/rateLimit';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.'
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.'
});

router.post('/register', loginLimiter, register);
router.post('/login', loginLimiter, login);

// RUTAS DE RECUPERACIÓN
router.post('/forgot-password', resetLimiter, forgotPassword);
router.post('/reset-password/:token', resetLimiter, resetPassword);

// Rutas protegidas
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.delete('/me', protect, deleteUser);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;