import { Router } from 'express';
import { 
  register, 
  login, 
  updateProfile, 
  changePassword, 
  deleteUser,
  forgotPassword,    
  resetPassword      
} from '../controllers/authController'; 
import { protect } from '../middlewares/auth';

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

export default router;