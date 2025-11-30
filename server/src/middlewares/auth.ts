import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any; // Añadimos la propiedad user a la Request
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Buscamos el token en la cabecera (Header: Authorization: Bearer token123...)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 2. Verificamos el token con la palabra secreta
      const secret = process.env.JWT_SECRET || 'palabrasecretaparaeltoken';
      const decoded = jwt.verify(token, secret);

      // 3. Guardamos los datos del usuario en la petición
      req.user = decoded;
      
      next(); // ¡Pase usted!
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};