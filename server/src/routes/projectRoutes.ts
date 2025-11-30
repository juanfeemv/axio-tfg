import { Router } from 'express';
import { getMyProjects, getProjectById, createProject, deleteProject } from '../controllers/projectController';
import { protect } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// GET /api/projects -> Ver todos mis proyectos
router.get('/', protect, getMyProjects);

// GET /api/projects/:id -> Ver UN proyecto específico (NUEVA)
router.get('/:id', protect, getProjectById);

// POST /api/projects -> Subir proyecto
router.post('/', protect, upload.single('file'), createProject);

// DELETE /api/projects/:id -> Borrar proyecto
router.delete('/:id', protect, deleteProject);

export default router;