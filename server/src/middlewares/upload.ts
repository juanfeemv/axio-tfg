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
    // Ej: 17092384-midiseño.png
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// 2. Filtro de seguridad (Solo Imágenes y PDFs)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato no válido. Solo JPG, PNG, WEBP y PDF.'));
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