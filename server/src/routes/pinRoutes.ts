import { Router } from 'express';
import { getProjectPins, createPin, deletePin } from '../controllers/pinController';
import { protect } from '../middlewares/auth';

const router = Router();

// GET /api/pins/:projectId (Ver pines)
router.get('/:projectId', protect, getProjectPins);

// POST /api/pins (Crear pin)
router.post('/', protect, createPin);

// DELETE /api/pins/:pinId (Borrar pin)
router.delete('/:pinId', protect, deletePin);

export default router;