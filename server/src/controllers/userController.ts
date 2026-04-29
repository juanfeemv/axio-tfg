import { Request, Response } from 'express';
import User from '../models/User';
import Project from '../models/Project';

// GET /api/users/:username -> Perfil público y sus proyectos
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    if (!username) return res.status(400).json({ message: 'Falta username' });

    // Búsqueda case-insensitive por username
    const user = await User.findOne({ username: new RegExp(`^${username}$`, 'i') }).select('username avatar createdAt');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Traemos sus proyectos (ordenados por fecha)
    const projects = await Project.find({ owner: user._id }).sort({ createdAt: -1 }).lean();

    res.json({ success: true, user, projects });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

// GET /api/users/id/:id -> Perfil por id (opcional)
export const getUserProfileById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Falta id' });

    const user = await User.findById(id).select('username avatar createdAt');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const projects = await Project.find({ owner: user._id }).sort({ createdAt: -1 }).lean();

    res.json({ success: true, user, projects });
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

export default { getUserProfile, getUserProfileById };
