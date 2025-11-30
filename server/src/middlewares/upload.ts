import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Configurar DÓNDE se guardan los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    
    // Si la carpeta no existe, la crea automáticamente
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Le ponemos un nombre único con la fecha para que no se repitan
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Filtro Híbrido: Acepta Imágenes, PDF y Código Fuente
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  
  // Lista blanca de tipos MIME permitidos
  const allowedMimes = [
    // Imágenes
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    // Documentos
    'application/pdf',
    // Código Web
    'text/html', 'text/css', 'text/javascript', 'application/javascript',
    // Texto plano (para .ts, .tsx, .jsx, .json a veces se detectan así)
    'text/plain', 'application/json', 'application/octet-stream' 
  ];

  // Verificación extra por extensión (porque .ts a veces da tipos raros)
  const allowedExtensions = ['.html', '.css', '.js', '.jsx', '.ts', '.tsx', '.json'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`));
  }
};

// 3. Exportar la configuración lista para usar
export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Límite de 10MB por archivo
  }
});