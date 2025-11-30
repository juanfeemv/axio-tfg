import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Project from '../models/Project';
import Audit from '../models/Audit';
import { captureWebsite } from '../services/webScraper';

// GET /api/projects (Mis Proyectos)
export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    // Ordenamos por fecha de creación descendente (más nuevo primero)
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

// GET /api/projects/community (Todos los proyectos públicos)
export const getCommunityProjects = async (req: AuthRequest, res: Response) => {
  try {
    // Buscamos todos los proyectos, ordenados por fecha
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('owner', 'username'); 

    res.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching community:", error);
    res.status(500).json({ message: 'Error al cargar la comunidad' });
  }
};

// GET /api/projects/:id (Uno solo)
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    
    // Buscamos el proyecto por ID y traemos el nombre del dueño
    const project = await Project.findById(projectId).populate('owner', 'username');
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Buscamos la última auditoría asociada a este proyecto (si existe)
    const audit = await Audit.findOne({ project: projectId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      project,
      audit
    });

  } catch (error) {
    console.error("Error fetching single project:", error);
    res.status(500).json({ message: 'Error al cargar el proyecto' });
  }
};

// POST /api/projects (Crear sin IA)
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, type, url } = req.body;
    const userId = req.user.id;

    if (!title || !type) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    let inputData = url;
    if (type === 'file' || type === 'code') {
      if (!req.file) return res.status(400).json({ message: 'Falta el archivo' });
      inputData = req.file.filename;
    }
    
    if (type === 'url' && url) {
        try {
            // Opcional: Lógica para captura si fuera necesaria
        } catch (e) {
            console.log("No se pudo generar preview para el proyecto manual");
        }
    }

    const newProject = new Project({
      title: title || (type === 'url' ? url : req.file?.originalname),
      owner: userId,
      type: type,
      input: inputData,
      image: type === 'file' ? req.file?.filename : undefined,
      status: 'pending',
      accessibilityScore: 0
    });

    await newProject.save();

    res.status(201).json({
      success: true,
      data: newProject,
      message: 'Proyecto subido correctamente'
    });

  } catch (error: any) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: 'Error al crear el proyecto' });
  }
};

// DELETE /api/projects/:id (Eliminar)
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado para borrar este proyecto' });
    }

    await project.deleteOne();
    await Audit.deleteMany({ project: req.params.id });

    res.json({ success: true, message: 'Proyecto eliminado' });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
};

// --- NUEVO: DAR/QUITAR LIKE (PUT /api/projects/:id/like) ---
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Comprobamos si el usuario ya está en la lista de likes
    // Convertimos a string para asegurar comparación correcta de ObjectId
    const index = project.likes.findIndex((id) => id.toString() === userId);

    if (index === -1) {
      // NO le ha dado like -> AÑADIMOS
      project.likes.push(userId as any); // 'as any' a veces ayuda si TS se queja del tipo ObjectId
    } else {
      // YA le ha dado like -> QUITAMOS (Dislike)
      project.likes.splice(index, 1);
    }

    await project.save();

    res.json({ 
      success: true, 
      likes: project.likes.length, // Nuevo total
      liked: index === -1 // true si acabamos de dar like, false si lo quitamos
    });

  } catch (error) {
    console.error("Error like:", error);
    res.status(500).json({ message: 'Error al procesar like' });
  }
};