import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Pin from '../models/Pin';

// GET /api/pins/:projectId -> Obtener todos los pines de un proyecto
export const getProjectPins = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;

    const pins = await Pin.find({ project: projectId })
      .populate('author', 'username') // Traemos el nombre del autor para mostrarlo
      .sort({ createdAt: 1 }); // Los más viejos primero (orden de lectura)

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
    
    // Rellenamos los datos del autor antes de devolverlo para que el frontend pueda mostrar el nombre
    await newPin.populate('author', 'username');

    res.status(201).json({ success: true, data: newPin });

  } catch (error) {
    console.error("Error creating pin:", error);
    res.status(500).json({ message: 'Error al crear el pin' });
  }
};