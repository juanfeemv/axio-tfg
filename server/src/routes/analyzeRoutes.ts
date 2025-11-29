import { Router } from 'express';
import { analyzeImage, analyzeUrl } from '../controllers/analyzeController'; // Importamos ambas funciones
import { upload } from '../middlewares/upload'; // El "portero" de Multer

const router = Router();

// RUTA 1: Para subir IMÁGENES o PDFs (Multipart Form)
// Endpoint: POST http://localhost:3000/api/analyze
// Middleware: 'upload.single' busca un archivo en el campo "image"
router.post('/', upload.single('image'), analyzeImage);

// RUTA 2: Para analizar URLs (JSON Body)
// Endpoint: POST http://localhost:3000/api/analyze/url
// Body esperado: { "url": "https://google.es" }
router.post('/url', analyzeUrl);

export default router;