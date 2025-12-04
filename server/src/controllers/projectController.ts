import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import Project from '../models/Project';
import Audit from '../models/Audit';
import Pin from '../models/Pin';
import User from '../models/User';

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

// --- ACTUALIZADO: Obtener Comunidad con contexto de voto y CONTEO DE PINES ---
export const getCommunityProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('owner', 'username')
      .lean(); // Convertimos a objeto JS simple para poder inyectar propiedades

    // Añadimos el campo "myVote" y contamos los PINES
    const projectsWithUserData = await Promise.all(projects.map(async (p: any) => {
        const myRating = p.ratings?.find((r: any) => r.user.toString() === userId);
        
        // Contamos cuántos pines tiene este proyecto
        const commentsCount = await Pin.countDocuments({ project: p._id });

        return {
            ...p,
            myVote: myRating ? myRating.value : 0, // 0 si no ha votado
            votesCount: p.ratings?.length || 0,     // Total de votos
            commentsCount: commentsCount,           // <--- DATO NUEVO
            // Ocultamos el array de ratings por privacidad
            ratings: undefined 
        };
    }));

    res.json({ success: true, data: projectsWithUserData });
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

    // Nota: Si en el futuro quieres hacer proyectos privados, aquí iría la comprobación de seguridad.
    // Por ahora, permitimos verlos si tienes el enlace (para la comunidad).
    
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

    // 🔔 NOTIFICAR A N8N
    try {
      const n8nUrl = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/nuevo-proyecto';
      
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: newProject._id,
          title: newProject.title,
          type: newProject.type,
          url: newProject.input,
          owner: userId,
          createdAt: newProject.createdAt
        })
      });
      
      console.log('✅ Webhook n8n notificado correctamente');
    } catch (webhookError) {
      console.error('❌ Error al notificar n8n:', webhookError);
      // No bloqueamos la creación del proyecto si falla n8n
    }

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

// --- DAR/QUITAR LIKE (PUT /api/projects/:id/like) ---
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

// --- NUEVO: VOTAR PROYECTO (1-5 estrellas) ---
export const rateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { rating } = req.body; // Esperamos { rating: 5 }
    const projectId = req.params.id;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Voto inválido (1-5)' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // 1. Buscamos si ya votó
    const existingRatingIndex = project.ratings.findIndex(r => r.user.toString() === userId);

    if (existingRatingIndex !== -1) {
        // Actualizar voto existente
        project.ratings[existingRatingIndex].value = rating;
    } else {
        // Nuevo voto
        project.ratings.push({ user: userId as any, value: rating });
    }

    // 2. Recalcular la media (Average)
    const total = project.ratings.reduce((acc, r) => acc + r.value, 0);
    project.averageRating = parseFloat((total / project.ratings.length).toFixed(1));

    await project.save();

    res.json({ 
        success: true, 
        averageRating: project.averageRating,
        votesCount: project.ratings.length,
        myVote: rating
    });

  } catch (error) {
    console.error("Error rating:", error);
    res.status(500).json({ message: 'Error al votar' });
  }
};