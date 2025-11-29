import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Definimos las rutas
// POST http://localhost:3000/api/auth/register
router.post('/register', register); // <-- Nótese que aquí NO llamamos a la función register(), solo pasamos la referencia.

// POST http://localhost:3000/api/auth/login
router.post('/login', login);

export default router;