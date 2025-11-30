import { Router } from 'express';
import { getProjectPins, createPin } from '../controllers/pinController';
import { protect } from '../middlewares/auth';

const router = Router();

// GET /api/pins/:projectId (Ver pines)
router.get('/:projectId', protect, getProjectPins);

// POST /api/pins (Crear pin)
router.post('/', protect, createPin);

export default router;