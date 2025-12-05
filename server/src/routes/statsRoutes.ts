import express from 'express';
import { getWeeklyStats } from '../controllers/statsController';

const router = express.Router();

// Ruta pública (no necesita autenticación para que n8n pueda acceder)
router.get('/weekly', getWeeklyStats);

export default router;