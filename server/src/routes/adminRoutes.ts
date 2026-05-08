import { Router } from 'express';
import { protect, requireAdmin } from '../middlewares/auth.js';
import {
    // User management
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUserById,
    suspendUser,
    unsuspendUser,
    resetUserPassword,
    // Project management
    getAllProjects,
    getProjectByIdAdmin,
    updateProject,
    deleteProjectById,
    // Audit management
    getAllAudits,
    deleteAuditById,
    exportAudits,
    // Pin management
    getAllPins,
    deletePinById,
    updatePinVisibility,
    // Statistics
    getAdminStats,
    getAdminActivity,
    getConfig,
    updateConfig
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require authentication AND admin role
router.use(protect, requireAdmin);

// ==================== USER ROUTES ====================
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/unsuspend', unsuspendUser);
router.post('/users/:id/reset-password', resetUserPassword);
router.delete('/users/:id', deleteUserById);

// ==================== PROJECT ROUTES ====================
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProjectByIdAdmin);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProjectById);

// ==================== AUDIT ROUTES ====================
router.get('/audits', getAllAudits);
router.get('/audits/export', exportAudits);
router.delete('/audits/:id', deleteAuditById);

// ==================== PIN ROUTES ====================
router.get('/pins', getAllPins);
router.put('/pins/:id/visibility', updatePinVisibility);
router.delete('/pins/:id', deletePinById);

// ==================== STATISTICS ROUTES ====================
router.get('/stats', getAdminStats);
router.get('/activity', getAdminActivity);
router.get('/config', getConfig);
router.put('/config', updateConfig);

export default router;
