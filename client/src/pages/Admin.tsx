import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FolderOpen, FileText, MapPin, BarChart3, Plus, Edit2, Trash2, Search, X, Eye, EyeOff, Ban, Unlock, KeyRound, Star, StarOff, Activity, Settings, Tag } from 'lucide-react';
import brandLogo from '../assets/logo.png';
import * as adminService from '../services/adminService';

type TabType = 'overview' | 'users' | 'projects' | 'audits' | 'pins' | 'activity' | 'config';

export default function Admin() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Users state
    const [users, setUsers] = useState<any[]>([]);
    const [userSearch, setUserSearch] = useState('');
    const [userPage, setUserPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Projects state
    const [projects, setProjects] = useState<any[]>([]);
    const [projectSearch, setProjectSearch] = useState('');
    const [projectPage, setProjectPage] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);

    // Audits state
    const [audits, setAudits] = useState<any[]>([]);
    const [auditPage, setAuditPage] = useState(1);
    const [totalAudits, setTotalAudits] = useState(0);

    // Pins state
    const [pins, setPins] = useState<any[]>([]);
    const [pinPage, setPinPage] = useState(1);
    const [totalPins, setTotalPins] = useState(0);

    // Activity state
    const [activity, setActivity] = useState<any[]>([]);
    const [activityPage, setActivityPage] = useState(1);
    const [totalActivity, setTotalActivity] = useState(0);

    // Config state
    const [config, setConfig] = useState<any>(null);
    const [configSaving, setConfigSaving] = useState(false);

    const userSearchRef = useRef<HTMLInputElement>(null);
    const projectSearchRef = useRef<HTMLInputElement>(null);

    // Modal states
    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const handleUserSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setUserPage(1);
        loadUsers(userSearch, 1);
    };

    const handleProjectSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setProjectPage(1);
        loadProjects(projectSearch, 1);
    };

    // Load stats
    const loadStats = async () => {
        try {
            const data = await adminService.getAdminStats();
            setStats(data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    // Load users
    const loadUsers = async (search = userSearch, page = userPage) => {
        try {
            const data = await adminService.getAllUsers(search, page, 10);
            setUsers(data.users);
            setTotalUsers(data.pagination.total);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    // Load projects
    const loadProjects = async (search = projectSearch, page = projectPage) => {
        try {
            const data = await adminService.getAllProjects(search, page, 10);
            setProjects(data.projects);
            setTotalProjects(data.pagination.total);
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    };

    // Load audits
    const loadAudits = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllAudits(auditPage, 10);
            setAudits(data.audits);
            setTotalAudits(data.pagination.total);
        } catch (error) {
            console.error('Error loading audits:', error);
        }
        setLoading(false);
    };

    // Load pins
    const loadPins = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAllPins(pinPage, 10);
            setPins(data.pins);
            setTotalPins(data.pagination.total);
        } catch (error) {
            console.error('Error loading pins:', error);
        }
        setLoading(false);
    };

    // Delete user
    const handleDeleteUser = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este usuario y todos sus datos?')) return;
        try {
            await adminService.deleteUser(id);
            loadUsers();
            loadStats();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al eliminar usuario');
        }
    };

    // Delete project
    const handleDeleteProject = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) return;
        try {
            await adminService.deleteProject(id);
            loadProjects();
            loadStats();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al eliminar proyecto');
        }
    };

    // Delete audit
    const handleDeleteAudit = async (id: string) => {
        if (!confirm(' ¿Seguro de eliminar esta auditoría?')) return;
        try {
            await adminService.deleteAudit(id);
            loadAudits();
            loadStats();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error');
        }
    };

    // Delete pin
    const handleDeletePin = async (id: string) => {
        if (!confirm('¿Seguro de eliminar este pin?')) return;
        try {
            await adminService.deletePin(id);
            loadPins();
            loadStats();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error');
        }
    };

    const handleSuspendUser = async (id: string) => {
        const reason = prompt('Motivo de suspensión (opcional):') || undefined;
        try {
            await adminService.suspendUser(id, reason);
            loadUsers();
            loadStats();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al suspender usuario');
        }
    };

    const handleUnsuspendUser = async (id: string) => {
        try {
            await adminService.unsuspendUser(id);
            loadUsers();
            loadStats();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al reactivar usuario');
        }
    };

    const handleResetPassword = async (id: string) => {
        if (!confirm('¿Resetear la contraseña de este usuario?')) return;
        try {
            const res = await adminService.resetUserPassword(id);
            alert(`Nueva contraseña temporal: ${res.tempPassword}`);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al resetear contraseña');
        }
    };

    const handleToggleProjectVisibility = async (project: any) => {
        const nextHidden = !project.isHidden;
        const reason = nextHidden ? (prompt('Motivo para ocultar (opcional):') || undefined) : undefined;
        try {
            await adminService.updateProject(project._id, { isHidden: nextHidden, hiddenReason: reason });
            loadProjects();
            loadStats();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al actualizar proyecto');
        }
    };

    const handleToggleProjectFeatured = async (project: any) => {
        const nextFeatured = !project.isFeatured;
        try {
            await adminService.updateProject(project._id, { isFeatured: nextFeatured });
            loadProjects();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al actualizar destacado');
        }
    };

    const handleEditProjectMeta = async (project: any) => {
        const category = prompt('Categoría (opcional):', project.category || '') ?? project.category;
        const tagsInput = prompt('Etiquetas separadas por coma:', (project.tags || []).join(', '));
        if (tagsInput === null) return;
        const tags = tagsInput.split(',').map((t: string) => t.trim()).filter(Boolean);
        try {
            await adminService.updateProject(project._id, { category, tags });
            loadProjects();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al actualizar etiquetas');
        }
    };

    const handleTogglePinVisibility = async (pin: any) => {
        const nextHidden = !pin.isHidden;
        const reason = nextHidden ? (prompt('Motivo para ocultar (opcional):') || undefined) : undefined;
        try {
            await adminService.updatePinVisibility(pin._id, nextHidden, reason);
            loadPins();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al actualizar pin');
        }
    };

    const loadActivity = async () => {
        try {
            const data = await adminService.getAdminActivity(activityPage, 20);
            setActivity(data.activity || []);
            setTotalActivity(data.pagination?.total || 0);
        } catch (error) {
            console.error('Error loading activity:', error);
        }
    };

    const loadConfig = async () => {
        try {
            const data = await adminService.getConfig();
            setConfig(data);
        } catch (error) {
            console.error('Error loading config:', error);
        }
    };

    const handleSaveConfig = async () => {
        if (!config) return;
        setConfigSaving(true);
        try {
            await adminService.updateConfig({
                allowRegistration: config.allowRegistration,
                maintenanceMode: config.maintenanceMode,
                maxPinsPerProject: Number(config.maxPinsPerProject) || 0,
                maxUploadMb: Number(config.maxUploadMb) || 0
            });
            alert('Configuración actualizada');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al guardar configuración');
        } finally {
            setConfigSaving(false);
        }
    };

    const handleExportAudits = async () => {
        try {
            const blob = await adminService.exportAudits();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'audits.csv';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al exportar auditorías');
        }
    };

    // Load data based on active tab
    useEffect(() => {
        if (activeTab === 'overview') loadStats();
        else if (activeTab === 'users') loadUsers(userSearch, userPage);
        else if (activeTab === 'projects') loadProjects(projectSearch, projectPage);
        else if (activeTab === 'audits') loadAudits();
        else if (activeTab === 'pins') loadPins();
        else if (activeTab === 'activity') loadActivity();
        else if (activeTab === 'config') loadConfig();
    }, [activeTab]);

    // Usuario: recarga al cambiar de página
    useEffect(() => {
        if (activeTab === 'users') loadUsers(userSearch, userPage);
    }, [userPage, activeTab, userSearch]);

    // Proyecto: recarga al cambiar de página
    useEffect(() => {
        if (activeTab === 'projects') loadProjects(projectSearch, projectPage);
    }, [projectPage, activeTab, projectSearch]);

    useEffect(() => {
        if (activeTab === 'activity') loadActivity();
    }, [activityPage, activeTab]);

    // Usuario: recarga al tipear (simple debounce corto) y reinicia a página 1
    useEffect(() => {
        if (activeTab !== 'users') return;
        if (userPage !== 1) setUserPage(1);
        const id = setTimeout(() => {
            loadUsers(userSearch, 1);
        }, 250);
        return () => clearTimeout(id);
    }, [userSearch, activeTab]);

    // Proyecto: recarga al tipear (simple debounce corto) y reinicia a página 1
    useEffect(() => {
        if (activeTab !== 'projects') return;
        if (projectPage !== 1) setProjectPage(1);
        const id = setTimeout(() => {
            loadProjects(projectSearch, 1);
        }, 250);
        return () => clearTimeout(id);
    }, [projectSearch, activeTab]);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-8">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-slate-900/10">
                        <img src={brandLogo} alt="Logo" className="h-full w-full object-cover" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Panel de Administración</h1>
                        <p className="text-slate-500 dark:text-slate-400">Gestiona usuarios, proyectos y contenido</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <TabButton icon={<BarChart3 size={18} />} label="Resumen" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                <TabButton icon={<Users size={18} />} label="Usuarios" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                <TabButton icon={<FolderOpen size={18} />} label="Proyectos" active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} />
                <TabButton icon={<FileText size={18} />} label="Auditorías" active={activeTab === 'audits'} onClick={() => setActiveTab('audits')} />
                <TabButton icon={<MapPin size={18} />} label="Pines" active={activeTab === 'pins'} onClick={() => setActiveTab('pins')} />
                <TabButton icon={<Activity size={18} />} label="Actividad" active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
                <TabButton icon={<Settings size={18} />} label="Configuración" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div>
                </div>
            ) : (
                <>
                    {/* Overview Tab */}
                    {activeTab === 'overview' && stats && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Usuarios" value={stats.totals.users} subtitle={`${stats.usersByRole.admin} admins`} color="from-blue-500 to-blue-600" />
                            <StatCard title="Proyectos" value={stats.totals.projects} subtitle={`${stats.projectsByStatus.analyzed} analizados`} color="from-purple-500 to-purple-600" />
                            <StatCard title="Auditorías" value={stats.totals.audits} subtitle="Total de análisis" color="from-emerald-500 to-emerald-600" />
                            <StatCard title="Pines" value={stats.totals.pins} subtitle="Comentarios totales" color="from-orange-500 to-orange-600" />
                            <div className="md:col-span-2 lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-lg border-2 border-slate-100 dark:border-slate-700">
                                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3">Últimos 7 días</div>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Usuarios: {stats.last7Days?.users || 0}</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">Proyectos: {stats.last7Days?.projects || 0}</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">Auditorías: {stats.last7Days?.audits || 0}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <form className="relative flex-1 max-w-md" onSubmit={handleUserSearch}>
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Buscar usuarios..."
                                        className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        ref={userSearchRef}
                                    />
                                </form>
                                <button
                                    onClick={() => { setEditingUser(null); setShowUserModal(true); }}
                                    className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all"
                                >
                                    <Plus size={18} /> Crear Usuario
                                </button>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Usuario</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Email</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Rol</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Estado</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Proyectos</th>
                                            <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id || user._id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                <td className="p-4 font-medium text-slate-800 dark:text-white">{user.username}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{user.email}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isSuspended ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'}`}>
                                                        {user.isSuspended ? 'Suspendido' : 'Activo'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{user.projectCount || 0}</td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingUser(user); setShowUserModal(true); }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleResetPassword(user._id)}
                                                            className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
                                                            title="Resetear contraseña"
                                                        >
                                                            <KeyRound size={16} />
                                                        </button>
                                                        {user.isSuspended ? (
                                                            <button
                                                                onClick={() => handleUnsuspendUser(user._id)}
                                                                className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                                                                title="Reactivar usuario"
                                                            >
                                                                <Unlock size={16} />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleSuspendUser(user._id)}
                                                                className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                                                                title="Suspender usuario"
                                                            >
                                                                <Ban size={16} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Total: {totalUsers} usuarios
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={userPage === 1}
                                        onClick={() => setUserPage(userPage - 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        disabled={userPage * 10 >= totalUsers}
                                        onClick={() => setUserPage(userPage + 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Projects Tab */}
                    {activeTab === 'projects' && (
                        <div>
                            <div className="mb-6">
                                <form className="relative max-w-md" onSubmit={handleProjectSearch}>
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Buscar proyectos..."
                                        className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                                        value={projectSearch}
                                        onChange={(e) => setProjectSearch(e.target.value)}
                                        ref={projectSearchRef}
                                    />
                                </form>
                            </div>

                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Título</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Propietario</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Tipo</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Estado</th>
                                            <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((project) => (
                                            <tr
                                                key={project._id}
                                                className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                                                onClick={() => navigate(`/project/${project._id}`, { state: { from: 'admin' } })}
                                            >
                                                <td className="p-4 font-medium text-slate-800 dark:text-white">
                                                    <div>{project.title}</div>
                                                    {(project.category || (project.tags && project.tags.length > 0)) && (
                                                        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                            {project.category && <span className="mr-2">Categoría: {project.category}</span>}
                                                            {project.tags && project.tags.length > 0 && <span>Etiquetas: {project.tags.join(', ')}</span>}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{project.owner?.username || 'N/A'}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{project.type}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.status === 'analyzed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        project.status === 'failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        }`}>
                                                        {project.status}
                                                    </span>
                                                    {project.isHidden && (
                                                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                            Oculto
                                                        </span>
                                                    )}
                                                    {project.isFeatured && (
                                                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                            Destacado
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/project/${project._id}`, { state: { from: 'admin' } }); }}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                            title="Ver proyecto"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleToggleProjectFeatured(project); }}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                            title={project.isFeatured ? 'Quitar destacado' : 'Destacar proyecto'}
                                                        >
                                                            {project.isFeatured ? <StarOff size={16} /> : <Star size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleEditProjectMeta(project); }}
                                                            className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                            title="Editar etiquetas y categoría"
                                                        >
                                                            <Tag size={16} />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleToggleProjectVisibility(project); }}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                                                            title={project.isHidden ? 'Mostrar proyecto' : 'Ocultar proyecto'}
                                                        >
                                                            {project.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteProject(project._id); }}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Total: {totalProjects} proyectos
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={projectPage === 1}
                                        onClick={() => setProjectPage(projectPage - 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        disabled={projectPage * 10 >= totalProjects}
                                        onClick={() => setProjectPage(projectPage + 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Audits Tab */}
                    {activeTab === 'audits' && (
                        <div>
                            <div className="flex justify-end mb-4">
                                <button
                                    onClick={handleExportAudits}
                                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                                >
                                    Exportar CSV
                                </button>
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Proyecto</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Puntuación</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Problemas</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Fecha</th>
                                            <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {audits.map((audit) => (
                                            <tr key={audit._id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                <td className="p-4 font-medium text-slate-800 dark:text-white">{audit.project?.title || 'N/A'}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{audit.score}/100</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{audit.issues?.length || 0}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">
                                                    {new Date(audit.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleDeleteAudit(audit._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Total: {totalAudits} auditorías
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={auditPage === 1}
                                        onClick={() => setAuditPage(auditPage - 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        disabled={auditPage * 10 >= totalAudits}
                                        onClick={() => setAuditPage(auditPage + 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pins Tab */}
                    {activeTab === 'pins' && (
                        <div>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Contenido</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Proyecto</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Autor</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Fecha</th>
                                            <th className="text-right p-4 font-semibold text-slate-700 dark:text-slate-300">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pins.map((pin) => (
                                            <tr key={pin._id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                <td className="p-4 font-medium text-slate-800 dark:text-white max-w-xs truncate">{pin.content}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{pin.project?.title || 'N/A'}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{pin.author?.username || 'N/A'}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">
                                                    {new Date(pin.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleTogglePinVisibility(pin)}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
                                                            title={pin.isHidden ? 'Mostrar pin' : 'Ocultar pin'}
                                                        >
                                                            {pin.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePin(pin._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Total: {totalPins} pines
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={pinPage === 1}
                                        onClick={() => setPinPage(pinPage - 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        disabled={pinPage * 10 >= totalPins}
                                        onClick={() => setPinPage(pinPage + 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === 'activity' && (
                        <div>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Accion</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Tipo</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Detalle</th>
                                            <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-300">Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activity.map((item) => (
                                            <tr key={item.timestamp} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700">
                                                <td className="p-4 font-medium text-slate-800 dark:text-white">{item.action}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">{item.targetType}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400 max-w-md truncate">{item.details || '-'}</td>
                                                <td className="p-4 text-slate-600 dark:text-slate-400">
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                    Total: {totalActivity} acciones
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        disabled={activityPage === 1}
                                        onClick={() => setActivityPage(activityPage - 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        disabled={activityPage * 20 >= totalActivity}
                                        onClick={() => setActivityPage(activityPage + 1)}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Config Tab */}
                    {activeTab === 'config' && (
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 space-y-6">
                            {!config ? (
                                <div className="text-slate-500 dark:text-slate-400">Cargando configuracion...</div>
                            ) : (
                                <>
                            <div className="grid md:grid-cols-2 gap-6">
                                <label className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-white">Registro de usuarios</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Permitir nuevos registros</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={!!config?.allowRegistration}
                                        onChange={(e) => setConfig({ ...config, allowRegistration: e.target.checked })}
                                        className="h-5 w-5"
                                    />
                                </label>

                                <label className="flex items-center justify-between gap-4">
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-white">Modo mantenimiento</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">Bloquea nuevas acciones</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={!!config?.maintenanceMode}
                                        onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                                        className="h-5 w-5"
                                    />
                                </label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Max. pines por proyecto</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={config?.maxPinsPerProject ?? 100}
                                        onChange={(e) => setConfig({ ...config, maxPinsPerProject: Number(e.target.value) })}
                                        className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Max. upload (MB)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={config?.maxUploadMb ?? 10}
                                        onChange={(e) => setConfig({ ...config, maxUploadMb: Number(e.target.value) })}
                                        className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none dark:bg-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveConfig}
                                    disabled={configSaving}
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {configSaving ? 'Guardando...' : 'Guardar configuracion'}
                                </button>
                            </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* User Modal */}
            {showUserModal && <UserModal user={editingUser} onClose={() => setShowUserModal(false)} onSuccess={() => { setShowUserModal(false); loadUsers(); loadStats(); }} />}
        </div>
    );
}

// Helper Components
function TabButton({ icon, label, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${active
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
        >
            {icon}
            <span className="whitespace-nowrap">{label}</span>
        </button>
    );
}

function StatCard({ title, value, subtitle, color }: any) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-xl transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2`}></div>
            <div className="relative">
                <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-1">{title}</div>
                <div className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{value.toLocaleString()}</div>
                <div className="text-slate-400 dark:text-slate-500 text-xs">{subtitle}</div>
            </div>
        </div>
    );
}

function UserModal({ user, onClose, onSuccess }: any) {
    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'user'
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (user) {
                // Update
                await adminService.updateUser(user._id, {
                    username: formData.username,
                    email: formData.email,
                    role: formData.role
                });
            } else {
                // Create
                if (!formData.password) {
                    alert('La contraseña es requerida para crear un usuario');
                    setLoading(false);
                    return;
                }
                await adminService.createUser(formData);
            }
            onSuccess();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                        {user ? 'Editar Usuario' : 'Crear Usuario'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre de usuario</label>
                        <input
                            type="text"
                            required
                            className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none dark:bg-slate-900 dark:text-white"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none dark:bg-slate-900 dark:text-white"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {!user && (
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Contraseña</label>
                            <input
                                type="password"
                                required={!user}
                                className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none dark:bg-slate-900 dark:text-white"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Rol</label>
                        <select
                            className="w-full border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:border-blue-500 outline-none dark:bg-slate-900 dark:text-white"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : user ? 'Actualizar' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
