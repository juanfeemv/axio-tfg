import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middlewares/auth';
import User from '../models/User';
import Project from '../models/Project';
import Audit from '../models/Audit';
import Pin from '../models/Pin';
import Admin from '../models/Admin';

// Helper function to log admin activity
const logActivity = async (admin: any, action: string, targetType: string, targetId?: any, details?: string) => {
    if (admin) {
        await admin.logActivity(action, targetType, targetId, details);
    }
};

// ==================== USER MANAGEMENT ====================

// GET /api/admin/users - Get all users with pagination and search
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        // Build search query
        const searchQuery = search
            ? {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }
            : {};

        const users = await User.find(searchQuery)
            .select('-password -resetPasswordToken -resetPasswordExpires')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(searchQuery);

        // Get project count for each user
        const usersWithStats = await Promise.all(
            users.map(async (user) => {
                const projectCount = await Project.countDocuments({ owner: user._id });
                return {
                    ...user.toObject(),
                    projectCount
                };
            })
        );

        res.json({
            users: usersWithStats,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// GET /api/admin/users/:id - Get user by ID
export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -resetPasswordToken -resetPasswordExpires');

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const projectCount = await Project.countDocuments({ owner: user._id });

        res.json({
            ...user.toObject(),
            projectCount
        });
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
};

// POST /api/admin/users - Create new user
export const createUser = async (req: AuthRequest, res: Response) => {
    try {
        const { username, email, password, role = 'user' } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Faltan campos requeridos' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        // If creating an admin user, create Admin record
        if (role === 'admin' && req.admin) {
            const newAdmin = new Admin({
                user: newUser._id,
                createdBy: req.user.id,
                permissions: {
                    manageUsers: true,
                    manageProjects: true,
                    manageAudits: true,
                    managePins: true,
                    viewStats: true
                }
            });
            await newAdmin.save();
        }

        // Log activity
        await logActivity(req.admin, 'create', 'user', newUser._id, `Created user: ${username}`);

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};

// PUT /api/admin/users/:id - Update user
export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { username, email, role } = req.body;
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'El email ya está en uso' });
            }
            user.email = email;
        }

        const oldRole = user.role;
        if (username) user.username = username;
        if (role && ['user', 'admin'].includes(role)) user.role = role;

        await user.save();

        // If role changed to admin, create Admin record
        if (role === 'admin' && oldRole !== 'admin' && req.admin) {
            const adminExists = await Admin.findOne({ user: userId });
            if (!adminExists) {
                const newAdmin = new Admin({
                    user: userId,
                    createdBy: req.user.id,
                    permissions: {
                        manageUsers: true,
                        manageProjects: true,
                        manageAudits: true,
                        managePins: true,
                        viewStats: true
                    }
                });
                await newAdmin.save();
            }
        }

        // If role changed from admin to user, deactivate Admin record
        if (role === 'user' && oldRole === 'admin') {
            await Admin.findOneAndUpdate(
                { user: userId },
                { isActive: false }
            );
        }

        // Log activity
        await logActivity(req.admin, 'update', 'user', user._id, `Updated user: ${user.username}`);

        res.json({
            message: 'Usuario actualizado exitosamente',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

// DELETE /api/admin/users/:id - Delete user
export const deleteUserById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.params.id;

        // Prevent admin from deleting themselves
        if (req.user.id === userId) {
            return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Delete all user's projects
        const projects = await Project.find({ owner: userId });
        const projectIds = projects.map(p => p._id);

        // Delete all associated audits and pins
        await Audit.deleteMany({ project: { $in: projectIds } });
        await Pin.deleteMany({ project: { $in: projectIds } });

        // Delete user's pins on other projects
        await Pin.deleteMany({ author: userId });

        // Delete projects
        await Project.deleteMany({ owner: userId });

        // Delete Admin record if exists
        await Admin.deleteOne({ user: userId });

        // Log activity before deleting
        await logActivity(req.admin, 'delete', 'user', user._id, `Deleted user: ${user.username}`);

        // Delete user
        await User.findByIdAndDelete(userId);

        res.json({ message: 'Usuario y todos sus datos eliminados exitosamente' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

// ==================== PROJECT MANAGEMENT ====================

// GET /api/admin/projects - Get all projects
export const getAllProjects = async (req: AuthRequest, res: Response) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const searchQuery = search
            ? { title: { $regex: search, $options: 'i' } }
            : {};

        const projects = await Project.find(searchQuery)
            .populate('owner', 'username email')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Project.countDocuments(searchQuery);

        res.json({
            projects,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error getting projects:', error);
        res.status(500).json({ message: 'Error al obtener proyectos' });
    }
};

// GET /api/admin/projects/:id - Get project by ID
export const getProjectByIdAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('owner', 'username email');

        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Get associated audit
        const audit = await Audit.findOne({ project: project._id });

        // Get pins count
        const pinsCount = await Pin.countDocuments({ project: project._id });

        res.json({
            ...project.toObject(),
            audit,
            pinsCount
        });
    } catch (error) {
        console.error('Error getting project:', error);
        res.status(500).json({ message: 'Error al obtener proyecto' });
    }
};

// PUT /api/admin/projects/:id - Update project
export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        const { title, status, accessibilityScore } = req.body;
        const projectId = req.params.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        if (title) project.title = title;
        if (status && ['pending', 'analyzed', 'failed'].includes(status)) {
            project.status = status;
        }
        if (accessibilityScore !== undefined) {
            project.accessibilityScore = accessibilityScore;
        }

        await project.save();

        res.json({
            message: 'Proyecto actualizado exitosamente',
            project
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error al actualizar proyecto' });
    }
};

// DELETE /api/admin/projects/:id - Delete project
export const deleteProjectById = async (req: AuthRequest, res: Response) => {
    try {
        const projectId = req.params.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Proyecto no encontrado' });
        }

        // Delete associated audits and pins
        await Audit.deleteMany({ project: projectId });
        await Pin.deleteMany({ project: projectId });

        // Log activity
        await logActivity(req.admin, 'delete', 'project', project._id, `Deleted project: ${project.title}`);

        // Delete project
        await Project.findByIdAndDelete(projectId);

        res.json({ message: 'Proyecto y datos asociados eliminados exitosamente' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error al eliminar proyecto' });
    }
};

// ==================== AUDIT MANAGEMENT ====================

// GET /api/admin/audits - Get all audits
export const getAllAudits = async (req: AuthRequest, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const audits = await Audit.find()
            .populate({
                path: 'project',
                populate: { path: 'owner', select: 'username email' }
            })
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Audit.countDocuments();

        res.json({
            audits,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error getting audits:', error);
        res.status(500).json({ message: 'Error al obtener auditorías' });
    }
};

// DELETE /api/admin/audits/:id - Delete audit
export const deleteAuditById = async (req: AuthRequest, res: Response) => {
    try {
        const auditId = req.params.id;

        const audit = await Audit.findById(auditId);
        if (!audit) {
            return res.status(404).json({ message: 'Auditoría no encontrada' });
        }

        // Log activity
        await logActivity(req.admin, 'delete', 'audit', audit._id, `Deleted audit with score: ${audit.score}`);

        await Audit.findByIdAndDelete(auditId);

        res.json({ message: 'Auditoría eliminada exitosamente' });
    } catch (error) {
        console.error('Error deleting audit:', error);
        res.status(500).json({ message: 'Error al eliminar auditoría' });
    }
};

// ==================== PIN MANAGEMENT ====================

// GET /api/admin/pins - Get all pins
export const getAllPins = async (req: AuthRequest, res: Response) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const pins = await Pin.find()
            .populate('author', 'username email')
            .populate('project', 'title')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Pin.countDocuments();

        res.json({
            pins,
            pagination: {
                total,
                page: pageNum,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        console.error('Error getting pins:', error);
        res.status(500).json({ message: 'Error al obtener pines' });
    }
};

// DELETE /api/admin/pins/:id - Delete pin
export const deletePinById = async (req: AuthRequest, res: Response) => {
    try {
        const pinId = req.params.id;

        const pin = await Pin.findById(pinId);
        if (!pin) {
            return res.status(404).json({ message: 'Pin no encontrado' });
        }

        // Log activity
        await logActivity(req.admin, 'delete', 'pin', pin._id, `Deleted pin: ${pin.content.substring(0, 30)}...`);

        await Pin.findByIdAndDelete(pinId);

        res.json({ message: 'Pin eliminado exitosamente' });
    } catch (error) {
        console.error('Error deleting pin:', error);
        res.status(500).json({ message: 'Error al eliminar pin' });
    }
};

// ==================== STATISTICS ====================

// GET /api/admin/stats - Get admin dashboard statistics
export const getAdminStats = async (req: AuthRequest, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalAudits = await Audit.countDocuments();
        const totalPins = await Pin.countDocuments();

        // Count users by role
        const adminCount = await User.countDocuments({ role: 'admin' });
        const userCount = await User.countDocuments({ role: 'user' });

        // Count projects by status
        const pendingProjects = await Project.countDocuments({ status: 'pending' });
        const analyzedProjects = await Project.countDocuments({ status: 'analyzed' });
        const failedProjects = await Project.countDocuments({ status: 'failed' });

        // Get recent activity
        const recentUsers = await User.find()
            .select('username email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentProjects = await Project.find()
            .populate('owner', 'username email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totals: {
                users: totalUsers,
                projects: totalProjects,
                audits: totalAudits,
                pins: totalPins
            },
            usersByRole: {
                admin: adminCount,
                user: userCount
            },
            projectsByStatus: {
                pending: pendingProjects,
                analyzed: analyzedProjects,
                failed: failedProjects
            },
            recentActivity: {
                users: recentUsers,
                projects: recentProjects
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};
