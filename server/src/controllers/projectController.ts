import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Project from '../models/Project';
import Audit from '../models/Audit';
import { captureWebsite } from '../services/webScraper';

// GET /api/projects (Todos los del usuario)
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

// --- NUEVO: GET /api/projects/:id (Uno solo) ---
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    
    // Buscamos el proyecto por ID
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    // Seguridad: Verificar que el proyecto pertenece al usuario que lo pide
    if (project.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'No tienes permiso para ver este proyecto' });
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
    
    // Intentar sacar captura si es URL (aunque no se use IA, para la portada)
    let screenshotFilename;
    if (type === 'url' && url) {
        try {
            // Opcional: Si quieres que tenga foto de portada aunque no se analice con IA
            // const { imageBase64 } = await captureWebsite(url);
            // ... lógica de guardado de imagen ...
        } catch (e) {
            console.log("No se pudo generar preview para el proyecto manual");
        }
    }

    const newProject = new Project({
      title: title || (type === 'url' ? url : req.file?.originalname),
      owner: userId,
      type: type,
      input: inputData,
      image: type === 'file' ? req.file?.filename : undefined, // Guardamos imagen si es archivo visual
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

    // Verificar que el usuario es el dueño antes de borrar
    if (project.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'No autorizado para borrar este proyecto' });
    }

    // Borramos el proyecto
    await project.deleteOne();
    
    // Opcional: Borrar también las auditorías asociadas para no dejar basura
    await Audit.deleteMany({ project: req.params.id });

    res.json({ success: true, message: 'Proyecto eliminado' });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: 'Error al eliminar el proyecto' });
  }
};