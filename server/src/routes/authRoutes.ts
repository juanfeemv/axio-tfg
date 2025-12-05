import { Router } from 'express';
import { register, login, updateProfile, changePassword, deleteUser } from '../controllers/authController'; 
import { protect } from '../middlewares/auth'; // Necesito proteger estas rutas

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Rutas protegidas (necesitan token)
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// DELETE /api/auth/me -> Borrar mi cuenta 
router.delete('/me', protect, deleteUser); 

export default router;