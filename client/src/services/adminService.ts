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

export const updateProject = async (id: string, projectData: { title?: string; status?: string; accessibilityScore?: number }) => {
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

// ==================== STATISTICS ====================

export const getAdminStats = async () => {
    const res = await api.get('/admin/stats');
    return res.data;
};
