import { Router } from 'express';
import { 
  getMyProjects, 
  getProjectById, 
  createProject, 
  deleteProject, 
  getCommunityProjects, 
  toggleLike,
  rateProject
} from '../controllers/projectController';
import { protect } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// GET /api/projects -> Ver todos mis proyectos privados
router.get('/', protect, getMyProjects);

// GET /api/projects/community -> Ver proyectos públicos de la comunidad
router.get('/community', protect, getCommunityProjects);

// GET /api/projects/:id -> Ver UN proyecto específico
router.get('/:id', protect, getProjectById);

// POST /api/projects -> Subir proyecto (con o sin archivo)
router.post('/', protect, upload.single('file'), createProject);

// DELETE /api/projects/:id -> Borrar proyecto
router.delete('/:id', protect, deleteProject);

// PUT /api/projects/:id/like -> Dar o quitar like
router.put('/:id/like', protect, toggleLike);

// PUT /api/projects/:id/rate -> Votar proyecto (1-5 estrellas) (NUEVO)
router.put('/:id/rate', protect, rateProject);

export default router;