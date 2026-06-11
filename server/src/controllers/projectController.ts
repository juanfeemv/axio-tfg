import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AuthRequest } from '../middlewares/auth.js';
import Project from '../models/Project.js';
import Audit from '../models/Audit.js';
import Pin from '../models/Pin.js';
import User from '../models/User.js';
import { captureWebsite } from '../services/webScraper.js';
import { getSiteConfig } from '../utils/siteConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/projects (Mis Proyectos)
export const getMyProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const projects = await Project.find({ owner: userId }).sort({ createdAt: -1 }).lean();

    // Añadir número real de issues desde Audit (1 query por proyecto, sin afectar a Gemini)
    const projectsWithIssues = await Promise.all(projects.map(async (p: any) => {
      const audit = await Audit.findOne({ project: p._id }).select('issues').lean();
      return { ...p, issuesCount: audit?.issues?.length || 0 };
    }));

    res.json({
      success: true,
      count: projectsWithIssues.length,
      data: projectsWithIssues
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
    const projects = await Project.find({ isHidden: { $ne: true } })
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(20)
      .populate('owner', 'username')
      .lean(); // Convertimos a objeto JS simple 

    // Añadimos el campo "myVote" y contamos los PINES
    const projectsWithUserData = await Promise.all(projects.map(async (p: any) => {
        const myRating = p.ratings?.find((r: any) => r.user.toString() === userId);
        
        // Contamos cuántos pines tiene este proyecto
        const commentsCount = await Pin.countDocuments({ project: p._id });

        return {
            ...p,
            myVote: myRating ? myRating.value : 0, // 0 si no ha votado
            votesCount: p.ratings?.length || 0,     // Total de votos
            commentsCount: commentsCount,          
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
    const project = await Project.findById(projectId).populate('owner', 'username avatar');
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    if (project.isHidden && project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Proyecto no disponible' });
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
    const config = await getSiteConfig();
    if (config.maintenanceMode) {
      return res.status(503).json({ message: 'Plataforma en mantenimiento' });
    }

    if (!title || !type) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    let inputData = url;
    let imageFilename: string | undefined;
    if (type === 'file' || type === 'code') {
      if (!req.file) return res.status(400).json({ message: 'Falta el archivo' });
      if (req.file.size > config.maxUploadMb * 1024 * 1024) {
        const uploadDir = path.join(__dirname, '../../uploads');
        const filePath = path.join(uploadDir, req.file.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return res.status(400).json({ message: `Archivo supera el maximo de ${config.maxUploadMb}MB` });
      }
      inputData = req.file.filename;
    }
    
    // Intentar sacar captura si es URL (aunque no se use IA, para la portada)
    if (type === 'url' && url) {
        try {
          const { imageBase64 } = await captureWebsite(url);
          const filename = `url-${Date.now()}.png`;
          const uploadDir = path.join(__dirname, '../../uploads');
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(imageBase64, 'base64'));
          imageFilename = filename;
        } catch (e) {
            console.log("No se pudo generar preview para el proyecto manual", e);
        }
    }

    const newProject = new Project({
      title: title || (type === 'url' ? url : req.file?.originalname),
      owner: userId,
      type: type,
      input: inputData,
      image: type === 'file' ? req.file?.filename : imageFilename, // Guardamos imagen si es archivo visual o captura de URL
      status: 'pending',
      accessibilityScore: 0
    });

    await newProject.save();

    // 🔔 NOTIFICAR A N8N
    try {
      const n8nUrl = process.env.N8N_WEBHOOK_URL || 'http://n8n:5678/webhook/nuevo-proyecto';
      
      const userInfo = await User.findById(userId).select('username email');
      
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: newProject._id,
          title: newProject.title,
          type: newProject.type,
          url: newProject.input,
          owner: userId,
          ownerName: userInfo?.username || userInfo?.email || 'Usuario Anónimo',
          createdAt: newProject.createdAt
        })
      });
      
      console.log('✅ Webhook n8n notificado correctamente');
    } catch (webhookError) {
      console.error('❌ Error al notificar n8n:', webhookError);
      // No bloqueamos la creación del proyecto si falla n8n
    }

    // 🎮 NOTIFICAR A DISCORD via n8n
    try {
      const discordUrl = process.env.N8N_WEBHOOK_URL_DISCORD;
      if (discordUrl) {
        const userInfo = await User.findById(userId).select('username email');
        await fetch(discordUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: newProject._id,
            title: newProject.title,
            type: newProject.type,
            url: newProject.input,
            ownerName: userInfo?.username || userInfo?.email || 'Usuario Anónimo',
            createdAt: newProject.createdAt,
            score: newProject.accessibilityScore ?? 0,
            hasAI: false
          })
        });
        console.log('✅ Discord notificado correctamente');
      }
    } catch (discordError) {
      console.error('❌ Error al notificar Discord:', discordError);
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
// Toggle like: si el usuario ya dio like → lo quita (dislike); si no → lo añade.
// Operación atómica sobre el array embebido likes[] del documento Project.
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });

    // Comprobar si el usuario ya está en la lista de likes
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
      likes: project.likes.length, 
      liked: index === -1 // true si acabamos de dar like, false si lo quitamos
    });

  } catch (error) {
    console.error("Error like:", error);
    res.status(500).json({ message: 'Error al procesar like' });
  }
};

// Votar proyecto 1-5 estrellas: si el usuario ya votó → actualiza su voto; si no → añade.
// Después recalcula averageRating como la media de todas las valoraciones.
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