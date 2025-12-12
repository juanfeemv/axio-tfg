import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Admin from '../models/Admin';

export interface AuthRequest extends Request {
  user?: any; // Añadimos la propiedad user a la Request
  admin?: any; // Añadimos la propiedad admin para el registro de Admin
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

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- MIDDLEWARE PARA VERIFICAR ROL DE ADMIN ---
export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Verificamos que el usuario esté autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // Buscamos el usuario en la BD para verificar su rol (USA User)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificamos que tenga rol de admin en User
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }

    // Verificamos que exista y esté activo en la tabla Admin (USA Admin)
    const adminRecord = await Admin.findOne({ user: user._id, isActive: true });

    if (!adminRecord) {
      return res.status(403).json({ message: 'Acceso denegado. Registro de administrador no encontrado o inactivo.' });
    }

    // Guardamos el registro de admin en la request para uso posterior
    req.admin = adminRecord;

    // Actualizamos el último login
    adminRecord.lastLogin = new Date();
    await adminRecord.save();

    // Si es admin, continuamos
    next();
  } catch (error) {
    console.error('Error en requireAdmin middleware:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// --- MIDDLEWARE PARA VERIFICAR PERMISO ESPECÍFICO ---
export const requirePermission = (permissionKey: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.admin) {
        return res.status(403).json({ message: 'No hay registro de admin en la solicitud' });
      }

      // Verificamos si tiene el permiso específico
      const hasPermission = req.admin.permissions[permissionKey as keyof typeof req.admin.permissions];
      if (!hasPermission) {
        return res.status(403).json({
          message: `Acceso denegado. Se requiere el permiso: ${permissionKey}`
        });
      }

      next();
    } catch (error) {
      console.error('Error en requirePermission middleware:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };
};