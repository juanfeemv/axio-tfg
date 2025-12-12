import { Router } from 'express';
import { protect, requireAdmin } from '../middlewares/auth';
import {
    // User management
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUserById,
    // Project management
    getAllProjects,
    getProjectByIdAdmin,
    updateProject,
    deleteProjectById,
    // Audit management
    getAllAudits,
    deleteAuditById,
    // Pin management
    getAllPins,
    deletePinById,
    // Statistics
    getAdminStats
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication AND admin role
router.use(protect, requireAdmin);

// ==================== USER ROUTES ====================
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUserById);

// ==================== PROJECT ROUTES ====================
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectByIdAdmin);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProjectById);

// ==================== AUDIT ROUTES ====================
router.get('/audits', getAllAudits);
router.delete('/audits/:id', deleteAuditById);

// ==================== PIN ROUTES ====================
router.get('/pins', getAllPins);
router.delete('/pins/:id', deletePinById);

// ==================== STATISTICS ROUTES ====================
router.get('/stats', getAdminStats);

export default router;
