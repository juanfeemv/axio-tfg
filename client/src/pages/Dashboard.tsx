import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { 
  Upload, 
  Link2, 
  LogOut, 
  CheckCircle, 
  AlertTriangle, 
  PlusCircle, 
  FolderOpen, 
  Globe, 
  Settings as SettingsIcon,
  Zap, 
  FileCode, 
  Save,
  Menu, 
  X      
} from 'lucide-react';
import brandLogo from '../assets/logo.png';
import api from '../services/api';

// Importo las otras vistas
import MyProjects from './MyProjects';
import Settings from './Settings';
import Explore from './Explore';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState<'new' | 'projects' | 'explore' | 'settings'>(() => {
    if (location.state && location.state.tab) {
        return location.state.tab;
    }
    const savedTab = sessionStorage.getItem('dashboard_active_tab');
    return (savedTab as 'new' | 'projects' | 'explore' | 'settings') || 'new';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('dashboard_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (location.state && location.state.tab) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const [useAI, setUseAI] = useState(true);

  // Estados de la Auditoría
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // --- LÓGICA URL ---
  const handleUrlAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      if (useAI) {
        const res = await api.post('/analyze/url', { url });
        setResult(res.data.data);
      } else {
        await api.post('/projects', { 
          title: new URL(url).hostname, 
          type: 'url', 
          url: url 
        });
        alert("✅ Proyecto guardado. Ve a 'Mis Proyectos' para verlo.");
        setUrl('');
      }
    } catch (error) {
      console.error("Error URL:", error);
      alert("Error al procesar la web.");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA ARCHIVOS ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'code') => {
    if (!e.target.files?.[0]) return;
    
    setLoading(true);
    setResult(null);

    const file = e.target.files[0];
    const formData = new FormData();
    
    const fieldName = useAI ? 'image' : 'file';
    formData.append(fieldName, file);

    if (!useAI) {
        formData.append('title', file.name);
        formData.append('type', type === 'image' ? 'file' : 'code');
    }

    try {
      const endpoint = useAI ? '/analyze' : '/projects';
      
      const res = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (useAI) {
        setResult(res.data.data);
      } else {
        alert("✅ Archivo subido correctamente.");
      }
    } catch (error) {
      console.error("Error archivo:", error);
      alert("Error al subir el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden relative transition-colors duration-300"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(248,250,252,0.9), rgba(226,232,240,0.92)), url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22none%22 stroke=%22%23cbd5e1%22 stroke-width=%220.5%22 opacity=%220.25%22%3E%3Cpath d=%27M0 20h40M20 0v40%27/%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2219%22/%3E%3C/g%3E%3C/svg%3E')",
        backgroundSize: 'cover, 360px 360px',
        backgroundBlendMode: 'overlay',
      }}
    >
      
      {/* --- HEADER MÓVIL --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-50 shadow-md">
         <div className="flex items-center gap-2">
          <img src={brandLogo} alt="AXIO" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-bold text-lg tracking-wider">AXIO</span>
         </div>
         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-300 hover:text-white">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
         </button>
      </div>

      {/* --- OVERLAY OSCURO --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR LATERAL */}
      <aside className={`
        fixed left-0 z-40 w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl 
        transform transition-transform duration-300 ease-in-out
        top-16 bottom-0
        md:top-0 md:relative
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="p-6 relative hidden md:block">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-slate-900/10">
              <img src={brandLogo} alt="AXIO" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                AXIO
              </h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 relative mt-4 md:mt-0 overflow-y-auto">
          <SidebarItem 
            icon={<PlusCircle size={20} />} 
            label="Nueva Auditoría" 
            active={activeTab === 'new'} 
            onClick={() => handleTabChange('new')} 
          />
          <SidebarItem 
            icon={<FolderOpen size={20} />} 
            label="Mis Proyectos" 
            active={activeTab === 'projects'} 
            onClick={() => handleTabChange('projects')} 
          />
          <SidebarItem 
            icon={<Globe size={20} />} 
            label="Comunidad" 
            active={activeTab === 'explore'} 
            onClick={() => handleTabChange('explore')} 
          />
          <div className="pt-4 mt-4 border-t border-slate-700/50">
            <SidebarItem 
              icon={<SettingsIcon size={20} />} 
              label="Configuración" 
              active={activeTab === 'settings'} 
              onClick={() => handleTabChange('settings')} 
            />
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-700/50 relative bg-slate-900/60">
          <div className="flex items-center gap-3 mb-3 p-3 bg-slate-800/70 rounded-xl border border-slate-700 shadow-sm">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold shadow-inner text-white">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-white">{user?.username}</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-3 text-slate-300 hover:text-red-400 hover:bg-slate-800 w-full p-3 rounded-xl transition-all text-sm font-semibold group"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" /> 
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative pt-16 md:pt-8 transition-all duration-300 px-2 md:px-6">
        
        {activeTab === 'new' && (
          <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full space-y-6">
            
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                    Hola, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.username}</span>
                  </h2>
                </div>
                <p className="text-slate-500 text-base md:text-lg dark:text-slate-400">¿Qué quieres subir hoy?</p>
              </div>
            </header>

            {/* --- INTERRUPTOR --- */}
            {!result && !loading && (
              <div className="mb-6 flex justify-center md:justify-start animate-fade-in">
                <div 
                  className="bg-white/80 dark:bg-slate-800/70 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-md flex items-center gap-2 cursor-pointer select-none overflow-hidden"
                  onClick={() => setUseAI(!useAI)}
                >
                  <div className={`px-5 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${useAI ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                    <span className="hidden sm:inline">Analizar con</span> IA
                  </div>
                  <div className={`px-5 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all duration-300 ${!useAI ? 'bg-emerald-500 text-white shadow-md scale-105' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'}`}>
                    <Save size={14} />
                    Solo Subir
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN INPUTS */}
            {!result && !loading && (
              <>
                <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
                  
                  {/* 1. Card URL */}
                  <div className="bg-white/75 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 dark:border-white/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden min-h-[280px] flex flex-col">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                      <Link2 size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 dark:text-white">Web en Vivo</h3>
                    <p className="text-slate-500 text-sm mb-6 h-10 line-clamp-2 dark:text-slate-400">
                      {useAI ? 'La IA navegará y detectará errores.' : 'Guarda la URL para compartirla.'}
                    </p>
                    
                    <form onSubmit={handleUrlAnalyze} className="relative">
                      <input 
                        type="url" 
                        placeholder="https://ejemplo.com" 
                        className="w-full border-2 border-slate-300 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                      />
                      <button 
                        type="submit"
                        className={`absolute right-2 top-2 bottom-2 text-white px-3 rounded-lg font-semibold transition-all shadow-lg hover:scale-105 ${useAI ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30' : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'}`}
                      >
                        →
                      </button>
                    </form>
                  </div>

                  {/* 2. Card Diseño */}
                  <div className="bg-white/75 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 dark:border-white/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden min-h-[280px] flex flex-col">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
                    <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                      <Upload size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 dark:text-white">Diseño Visual</h3>
                    <p className="text-slate-500 text-sm mb-6 h-10 line-clamp-2 dark:text-slate-400">
                      {useAI ? 'Sube una diseño (imagen o PDF) para análisis visual.' : 'Comparte un diseño (imagen o PDF) para feedback.'}
                    </p>
                    
                    <label className={`border-2 border-dashed border-slate-300 rounded-xl h-[52px] flex items-center justify-center cursor-pointer transition-all group-hover:shadow-md dark:border-slate-600 ${useAI ? 'hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20' : 'hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} accept="image/*,application/pdf" />
                      <span className={`text-sm font-semibold flex items-center gap-2 ${useAI ? 'text-slate-600 group-hover:text-purple-700 dark:text-slate-300 dark:group-hover:text-purple-400' : 'text-slate-600 group-hover:text-emerald-700 dark:text-slate-300 dark:group-hover:text-emerald-400'}`}>
                        <Upload size={16} /> {useAI ? 'Analizar' : 'Subir'}
                      </span>
                    </label>
                  </div>

                  {/* 3. Card CÓDIGO */}
                  <div className="bg-white/75 dark:bg-slate-800/70 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50 dark:border-white/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden min-h-[280px] flex flex-col">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                    <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/30">
                      <FileCode size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 dark:text-white">Código Fuente</h3>
                    <p className="text-slate-500 text-sm mb-6 h-10 line-clamp-2 dark:text-slate-400">
                      {useAI ? 'Revisión de código automática.' : 'Comparte código a la comunidad.'}
                    </p>
                    
                    <label className={`border-2 border-dashed border-slate-300 rounded-xl h-[52px] flex items-center justify-center cursor-pointer transition-all group-hover:shadow-md dark:border-slate-600 ${useAI ? 'hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'code')} accept=".html,.css,.js,.jsx,.ts,.tsx,.json" />
                      <span className={`text-sm font-semibold flex items-center gap-2 ${useAI ? 'text-slate-600 group-hover:text-blue-700 dark:text-slate-300 dark:group-hover:text-blue-400' : 'text-slate-600 group-hover:text-emerald-700 dark:text-slate-300 dark:group-hover:text-emerald-400'}`}>
                        <FileCode size={16} /> {useAI ? 'Analizar' : 'Subir'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* --- SECCIÓN DISCORD COMUNIDAD --- */}
                <div className="mt-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <a 
                    href="https://discord.gg/zh78ZtSF" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group border border-white/30 dark:border-white/10"
                    style={{
                      backgroundImage:
                        'radial-gradient(at 20% 20%, rgba(96,165,250,0.45), transparent 35%), radial-gradient(at 80% 0%, rgba(124,58,237,0.4), transparent 35%), radial-gradient(at 50% 100%, rgba(16,185,129,0.35), transparent 30%), radial-gradient(at 10% 80%, rgba(236,72,153,0.25), transparent 30%)',
                      backgroundColor: '#0f172a',
                    }}
                  >
                    <div className="absolute inset-0 opacity-25 mix-blend-screen" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22none%22 stroke=%22%23ffffff%22 stroke-width=%220.5%22 opacity=%220.3%22%3E%3Cpath d=%27M0 20h40M20 0v40%27/%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2219%22/%3E%3C/g%3E%3C/svg%3E')" }}></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left text-white">
                      <div className="flex items-center gap-5">
                        <div className="bg-white/15 p-4 rounded-xl backdrop-blur-sm shrink-0 border border-white/20">
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 0 0-.0785-.037 19.7363 19.7363 0 0 0-4.8852 1.515.0699.0699 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 0 0-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 0 1-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 0 1 .0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 0 1 .0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 0 1-.0066.1276 12.2986 12.2986 0 0 1-1.873.8914.0766.0766 0 0 0-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 0 0 .0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 0 0 .0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 0 0-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">Únete a la Comunidad</h3>
                          <p className="text-slate-100/90 text-sm mt-1 max-w-lg">Recibe notificaciones sobre tus proyectos y conecta con otros creadores en nuestro Discord.</p>
                        </div>
                      </div>
                      
                      <div className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md group-hover:scale-105 transition-transform whitespace-nowrap">
                        Unirse Ahora →
                      </div>
                    </div>
                  </a>
                </div>
              </>
            )}

            {/* SECCIÓN LOADER */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-[50vh] animate-fade-in">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin dark:border-slate-700"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src={brandLogo} alt="AXIO" className="h-10 w-10 rounded-lg animate-pulse object-cover" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2 dark:text-white">Procesando Proyecto</h3>
                <p className="text-slate-500 animate-pulse dark:text-slate-400">
                    {useAI ? 'La IA está revisando la accesibilidad...' : 'Guardando en la base de datos...'}
                </p>
                <div className="flex gap-2 mt-4">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}

            {/* SECCIÓN RESULTADOS */}
            {result && (
              <div className="animate-fade-in-up pb-10">
                <button 
                  onClick={() => setResult(null)}
                  className="mb-6 text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-2 transition-all hover:gap-3 group dark:text-slate-400 dark:hover:text-blue-400"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al inicio
                </button>

                <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-slate-900/10">
                            <img src={brandLogo} alt="AXIO" className="h-full w-full object-cover" />
                          </div>
                          <h2 className="text-3xl font-bold">Resultado de Auditoría</h2>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400 text-sm">
                          <span className="bg-slate-800 px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-semibold flex items-center gap-1">
                            <Zap size={12} />
                            IA Powered
                          </span>
                          <span>•</span>
                          <span>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Puntuación Global</div>
                          <div className="text-xs text-slate-500 mt-1">Basado en WCAG 2.1</div>
                        </div>
                        <div className={`
                          h-24 w-24 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-2xl border-4 relative overflow-hidden
                          ${result.score >= 80 ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400' : 
                            result.score >= 50 ? 'bg-gradient-to-br from-yellow-500 to-orange-600 border-yellow-400' : 
                            'bg-gradient-to-br from-red-500 to-pink-600 border-red-400'}
                        `}>
                          <span className="relative z-10 text-white">{result.score}</span>
                          <div className="absolute inset-0 bg-white/10"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center dark:bg-orange-900/30">
                        <AlertTriangle className="text-orange-600 dark:text-orange-400" size={20} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-xl dark:text-white">
                        {result.issues?.length || 0} Problemas Detectados
                      </h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {result.issues?.map((issue: any, index: number) => (
                        <div key={index} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-blue-500 dark:bg-slate-800 dark:border-slate-700">
                          <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
                            <span className="font-bold text-slate-800 text-lg dark:text-white">{issue.element || 'Elemento General'}</span>
                            <span className={`self-start text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide ${
                              issue.severity === 'high' ? 'bg-red-100 text-red-700 border-2 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 
                              issue.severity === 'medium' ? 'bg-orange-100 text-orange-800 border-2 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800' : 
                              'bg-blue-100 text-blue-700 border-2 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                            }`}>
                              {issue.severity === 'high' ? '🔴 Alta' : issue.severity === 'medium' ? '🟡 Media' : '🔵 Baja'}
                            </span>
                          </div>
                          
                          <p className="text-slate-600 mb-4 leading-relaxed dark:text-slate-300">{issue.problem || issue.issue}</p>
                          
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 text-sm p-4 rounded-xl flex gap-3 items-start dark:from-slate-900 dark:to-slate-800 dark:border-green-800 dark:text-green-400">
                            <CheckCircle size={20} className="mt-0.5 shrink-0 text-green-600 dark:text-green-500" />
                            <div>
                              <span className="font-bold block mb-1 text-green-900 dark:text-green-400">💡 Sugerencia de corrección:</span>
                              {issue.suggestion}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* OTRAS PESTAÑAS */}
        {activeTab === 'projects' && <MyProjects />}
        {activeTab === 'explore' && <Explore />}
        {activeTab === 'settings' && <Settings />}

      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium relative overflow-hidden group
        ${active 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/50' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
      `}
    >
      {active && <div className="absolute inset-0 bg-white/10"></div>}
      <span className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-lg ${active ? 'bg-white/15 text-white' : 'text-slate-400 group-hover:text-white group-hover:bg-slate-800/60'} transition-all`}>
        {icon}
      </span>
      <span className="relative z-10 font-semibold">{label}</span>
      {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>}
    </button>
  );
}