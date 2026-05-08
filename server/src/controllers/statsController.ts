import { Request, Response } from 'express';
import Project from '../models/Project.js';
import Pin from '../models/Pin.js';
import User from '../models/User.js';

export const getWeeklyStats = async (req: Request, res: Response) => {
  try {
    // Fecha de hace 7 días
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Contar proyectos nuevos esta semana
    const newProjects = await Project.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    // Contar comentarios nuevos esta semana
    const newComments = await Pin.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    // Top 3 proyectos más votados de la semana
    const topProjects = await Project.find({
      createdAt: { $gte: weekAgo }
    })
      .sort({ averageRating: -1 })
      .limit(3)
      .populate('owner', 'username')
      .select('title averageRating owner');

    // Total de usuarios registrados
    const totalUsers = await User.countDocuments();

    // Proyecto con mejor score de accesibilidad
    const bestAccessibility = await Project.findOne({
      createdAt: { $gte: weekAgo },
      accessibilityScore: { $gt: 0 }
    })
      .sort({ accessibilityScore: -1 })
      .populate('owner', 'username')
      .select('title accessibilityScore owner');

    res.json({
      success: true,
      data: {
        period: 'Últimos 7 días',
        newProjects,
        newComments,
        totalUsers,
        topProjects: topProjects.map(p => ({
          title: p.title,
          rating: p.averageRating || 0,
          owner: (p.owner as any).username
        })),
        bestAccessibility: bestAccessibility ? {
          title: bestAccessibility.title,
          score: bestAccessibility.accessibilityScore,
          owner: (bestAccessibility.owner as any).username
        } : null
      }
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
};