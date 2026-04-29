import api from './api';

// ==================== USER MANAGEMENT ====================

export const getAllUsers = async (search = '', page = 1, limit = 10) => {
    const res = await api.get('/admin/users', {
        params: { search, page, limit }
    });
    return res.data;
};

export const getUserById = async (id: string) => {
    const res = await api.get(`/admin/users/${id}`);
    return res.data;
};

export const createUser = async (userData: { username: string; email: string; password: string; role?: string }) => {
    const res = await api.post('/admin/users', userData);
    return res.data;
};

export const updateUser = async (id: string, userData: { username?: string; email?: string; role?: string }) => {
    const res = await api.put(`/admin/users/${id}`, userData);
    return res.data;
};

export const suspendUser = async (id: string, reason?: string) => {
    const res = await api.put(`/admin/users/${id}/suspend`, { reason });
    return res.data;
};

export const unsuspendUser = async (id: string) => {
    const res = await api.put(`/admin/users/${id}/unsuspend`);
    return res.data;
};

export const resetUserPassword = async (id: string) => {
    const res = await api.post(`/admin/users/${id}/reset-password`);
    return res.data;
};

export const deleteUser = async (id: string) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
};

// ==================== PROJECT MANAGEMENT ====================

export const getAllProjects = async (search = '', page = 1, limit = 10) => {
    const res = await api.get('/admin/projects', {
        params: { search, page, limit }
    });
    return res.data;
};

export const getProjectById = async (id: string) => {
    const res = await api.get(`/admin/projects/${id}`);
    return res.data;
};

export const updateProject = async (id: string, projectData: { title?: string; status?: string; accessibilityScore?: number; isHidden?: boolean; hiddenReason?: string; isFeatured?: boolean; tags?: string[]; category?: string }) => {
    const res = await api.put(`/admin/projects/${id}`, projectData);
    return res.data;
};

export const deleteProject = async (id: string) => {
    const res = await api.delete(`/admin/projects/${id}`);
    return res.data;
};

// ==================== AUDIT MANAGEMENT ====================

export const getAllAudits = async (page = 1, limit = 10) => {
    const res = await api.get('/admin/audits', {
        params: { page, limit }
    });
    return res.data;
};

export const deleteAudit = async (id: string) => {
    const res = await api.delete(`/admin/audits/${id}`);
    return res.data;
};

// ==================== PIN MANAGEMENT ====================

export const getAllPins = async (page = 1, limit = 10) => {
    const res = await api.get('/admin/pins', {
        params: { page, limit }
    });
    return res.data;
};

export const deletePin = async (id: string) => {
    const res = await api.delete(`/admin/pins/${id}`);
    return res.data;
};

export const updatePinVisibility = async (id: string, isHidden: boolean, reason?: string) => {
    const res = await api.put(`/admin/pins/${id}/visibility`, { isHidden, reason });
    return res.data;
};

// ==================== STATISTICS ====================

export const getAdminStats = async () => {
    const res = await api.get('/admin/stats');
    return res.data;
};

export const getAdminActivity = async (page = 1, limit = 20) => {
    const res = await api.get('/admin/activity', { params: { page, limit } });
    return res.data;
};

export const getConfig = async () => {
    const res = await api.get('/admin/config');
    return res.data;
};

export const updateConfig = async (config: { allowRegistration?: boolean; maintenanceMode?: boolean; maxPinsPerProject?: number; maxUploadMb?: number }) => {
    const res = await api.put('/admin/config', config);
    return res.data;
};

export const exportAudits = async () => {
    const res = await api.get('/admin/audits/export', { responseType: 'blob' });
    return res.data;
};
