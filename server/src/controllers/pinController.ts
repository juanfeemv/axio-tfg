import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Pin from '../models/Pin';
import Project from '../models/Project';
import User from '../models/User'; // 👈 NUEVO

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

    // 🔔 NOTIFICAR A N8N (Nuevo comentario/pin)
    try {
      const n8nUrl = process.env.N8N_WEBHOOK_URL_COMMENT || 'http://n8n:5678/webhook/nuevo-comentario';
      
      // Obtenemos info del autor del comentario
      const commentAuthor = await User.findById(userId).select('username email');
      
      // Obtenemos info del proyecto y su dueño
      const project = await Project.findById(projectId).populate('owner', 'username email');
      
      if (project) {
        await fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            commentId: newPin._id,
            content: newPin.content,
            commentAuthor: commentAuthor?.username || commentAuthor?.email || 'Usuario',
            commentAuthorId: userId,
            projectId: project._id,
            projectTitle: project.title,
            projectOwner: (project.owner as any).username || (project.owner as any).email || 'Usuario',
            projectOwnerId: (project.owner as any)._id,
            createdAt: newPin.createdAt,
            position: { x: newPin.x, y: newPin.y }
          })
        });
        
        console.log('✅ Webhook n8n notificado (nuevo comentario)');
      }
    } catch (webhookError) {
      console.error('❌ Error al notificar n8n:', webhookError);
      // No bloqueamos la creación del pin si falla n8n
    }

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