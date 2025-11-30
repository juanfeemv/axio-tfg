import { Router } from 'express';
import { getMyProjects } from '../controllers/projectController';
import { protect } from '../middlewares/auth';

const router = Router();

// Protegemos la ruta: Solo usuarios logueados pueden ver sus proyectos
router.get('/', protect, getMyProjects);

export default router;