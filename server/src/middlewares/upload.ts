import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Configurar dónde se guardan los archivos y con qué nombre
// diskStorage guarda en el sistema de archivos del servidor (no en memoria)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/'; // Carpeta relativa al directorio de trabajo

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Nombre único: timestamp + número aleatorio + extensión original
    // Ejemplo: 1712345678901-123456789.png
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Filtro de seguridad: solo permite tipos de archivo específicos
// Se valida tanto el MIME type (cabecera HTTP) como la extensión del archivo
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {

  const allowedMimes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',    // Imágenes
    'application/pdf',                                        // Documentos
    'text/html', 'text/css', 'text/javascript',               // Código web
    'application/javascript', 'text/plain', 'application/json',
    'application/octet-stream'                                // Fallback para .ts/.tsx
  ];

  // Extras por si el MIME no coincide (archivos .ts a veces dan tipos raros)
  const allowedExtensions = ['.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.json'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true); // Aceptar
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`)); // Rechazar
  }
};

// 3. Middleware listo para usar en las rutas como: upload.single('image')
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo por archivo
  }
});