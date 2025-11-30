import { Router } from 'express';
import { 
  getMyProjects, 
  getProjectById, 
  createProject, 
  deleteProject, 
  getCommunityProjects, 
  toggleLike // <--- Importamos la nueva función
} from '../controllers/projectController';
import { protect } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

// GET /api/projects -> Ver todos mis proyectos privados
router.get('/', protect, getMyProjects);

// GET /api/projects/community -> Ver proyectos públicos de la comunidad
// ⚠️ IMPORTANTE: Esta ruta debe ir ANTES de /:id para que no confunda "community" con un ID
router.get('/community', protect, getCommunityProjects);

// GET /api/projects/:id -> Ver UN proyecto específico
router.get('/:id', protect, getProjectById);

// POST /api/projects -> Subir proyecto (con o sin archivo)
router.post('/', protect, upload.single('file'), createProject);

// DELETE /api/projects/:id -> Borrar proyecto
router.delete('/:id', protect, deleteProject);

// PUT /api/projects/:id/like -> Dar o quitar like (NUEVO)
router.put('/:id/like', protect, toggleLike);

export default router;