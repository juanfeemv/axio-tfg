import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Pin from '../models/Pin';
import Project from '../models/Project'; // Importamos Project para verificar al dueño

// GET /api/pins/:projectId -> Obtener todos los pines de un proyecto
export const getProjectPins = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const pins = await Pin.find({ project: projectId })
      .populate('author', 'username') 
      .sort({ createdAt: 1 });

    res.json({ success: true, data: pins });
  } catch (error) {
    console.error("Error fetching pins:", error);
    res.status(500).json({ message: 'Error al obtener los comentarios' });
  }
};

// POST /api/pins -> Crear un nuevo pin
export const createPin = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, x, y, content } = req.body;
    const userId = req.user.id;

    if (!content || x === undefined || y === undefined) {
      return res.status(400).json({ message: 'Faltan datos del pin' });
    }

    const newPin = new Pin({
      project: projectId,
      author: userId,
      x,
      y,
      content
    });

    await newPin.save();
    
    await newPin.populate('author', 'username');

    res.status(201).json({ success: true, data: newPin });

  } catch (error) {
    console.error("Error creating pin:", error);
    res.status(500).json({ message: 'Error al crear el pin' });
  }
};

// DELETE /api/pins/:pinId -> Borrar un pin
export const deletePin = async (req: AuthRequest, res: Response) => {
    try {
      const { pinId } = req.params;
      const userId = req.user.id;
  
      const pin = await Pin.findById(pinId);
      if (!pin) {
        return res.status(404).json({ message: 'Pin no encontrado' });
      }
  
      // 1. Verificar si el usuario es el autor del pin
      if (pin.author.toString() === userId) {
        await pin.deleteOne();
        return res.json({ success: true, message: 'Pin eliminado correctamente' });
      }
  
      // 2. Verificar si el usuario es el DUEÑO del proyecto (moderación)
      const project = await Project.findById(pin.project);
      if (project && project.owner.toString() === userId) {
        await pin.deleteOne();
        return res.json({ success: true, message: 'Pin eliminado por el dueño del proyecto' });
      }
  
      return res.status(403).json({ message: 'No tienes permiso para borrar este comentario' });
  
    } catch (error) {
      console.error("Error deleting pin:", error);
      res.status(500).json({ message: 'Error al borrar el pin' });
    }
  };