import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Project from '../models/Project';

// GET /api/projects
export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    // req.user.id viene del middleware 'protect' que acabamos de crear
    const userId = req.user.id;

    // Buscamos proyectos donde el dueño sea este usuario
    // .sort({ createdAt: -1 }) ordena del más nuevo al más viejo
    const projects = await Project.find({ owner: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });

  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
};