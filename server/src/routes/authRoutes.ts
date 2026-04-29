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

const router = Router();

router.post('/register', register);
router.post('/login', login);

// RUTAS DE RECUPERACIÓN
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Rutas protegidas
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.delete('/me', protect, deleteUser);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;