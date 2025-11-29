import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Upload, 
  Link2, 
  LogOut, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  PlusCircle, 
  FolderOpen, 
  Globe, 
  Settings as SettingsIcon,
  Sparkles,
  Zap
} from 'lucide-react';
import axios from 'axios';

// Importamos las otras vistas
import MyProjects from './MyProjects';
import Settings from './Settings';
import Explore from './Explore';

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  // Estado de Navegación
  const [activeTab, setActiveTab] = useState<'new' | 'projects' | 'explore' | 'settings'>('new');

  // Estados de la Auditoría (IA)
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // --- LÓGICA DE AUDITORÍA (IA) ---

  const handleUrlAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post('http://localhost:3000/api/analyze/url', { url });
      setResult(res.data.data);
    } catch (error) {
      console.error("Error analizando URL:", error);
      alert("Error al analizar la web. Revisa que el servidor esté encendido.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    try {
      const res = await axios.post('http://localhost:3000/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data.data);
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      alert("Error al subir la imagen.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDERIZADO ---

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      
      {/* 1. SIDEBAR LATERAL */}
      <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl z-10 relative overflow-hidden">
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="p-6 relative">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-wider">
                AXIO
              </h1>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest">BETA v1.0</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 relative">
          <SidebarItem 
            icon={<PlusCircle size={20} />} 
            label="Nueva Auditoría" 
            active={activeTab === 'new'} 
            onClick={() => setActiveTab('new')} 
          />
          <SidebarItem 
            icon={<FolderOpen size={20} />} 
            label="Mis Proyectos" 
            active={activeTab === 'projects'} 
            onClick={() => setActiveTab('projects')} 
          />
          <SidebarItem 
            icon={<Globe size={20} />} 
            label="Comunidad" 
            active={activeTab === 'explore'} 
            onClick={() => setActiveTab('explore')} 
          />
          <div className="pt-4 mt-4 border-t border-slate-700/50">
            <SidebarItem 
              icon={<SettingsIcon size={20} />} 
              label="Configuración" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </div>
        </nav>
        
        {/* User section */}
        <div className="p-4 border-t border-slate-700/50 relative">
          <div className="flex items-center gap-3 mb-3 p-3 bg-slate-800/50 rounded-xl">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user?.username}</p>
              <p className="text-xs text-slate-400">Plan Gratuito</p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 w-full p-3 rounded-xl transition-all text-sm font-medium group"
          >
            <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" /> 
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto relative">
        
        {/* PESTAÑA: NUEVA AUDITORÍA */}
        {activeTab === 'new' && (
          <div className="p-8 max-w-6xl mx-auto min-h-full">
            
            {/* Cabecera de Bienvenida */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-4xl">👋</span>
                  <h2 className="text-3xl font-bold text-slate-800">
                    Hola, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{user?.username}</span>
                  </h2>
                </div>
                <p className="text-slate-500 text-lg">¿Qué vamos a mejorar hoy?</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan Gratuito</p>
                  <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline flex items-center gap-1">
                    <Zap size={14} />
                    Actualizar a Pro
                  </p>
                </div>
              </div>
            </header>

            {/* SECCIÓN INPUTS (Solo si no hay resultado) */}
            {!result && !loading && (
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
                
                {/* Card URL */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-200 hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                      <Link2 size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Web en Vivo</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                      Introduce una URL pública. Nuestra IA navegará por ella, capturará la pantalla y analizará la accesibilidad.
                    </p>
                    
                    <form onSubmit={handleUrlAnalyze} className="relative">
                      <input 
                        type="url" 
                        placeholder="https://ejemplo.com" 
                        className="w-full border-2 border-slate-300 rounded-xl px-5 py-4 pr-28 text-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/30 hover:scale-105"
                      >
                        Analizar
                      </button>
                    </form>
                  </div>
                </div>

                {/* Card Archivo */}
                <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-slate-200 hover:shadow-2xl hover:border-purple-300 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                      <Upload size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Diseño o Documento</h3>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                      Sube un mockup (JPG, PNG) o PDF. Ideal para validar accesibilidad en fases de diseño (Shift-Left Testing).
                    </p>
                    
                    <label className="border-2 border-dashed border-slate-300 rounded-xl h-[54px] flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group-hover:shadow-md">
                      <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
                      <span className="text-sm font-semibold text-slate-600 group-hover:text-purple-700 flex items-center gap-2">
                        <Upload size={16} /> Click para subir archivo
                      </span>
                    </label>
                  </div>
                </div>

              </div>
            )}

            {/* SECCIÓN LOADER */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-[50vh] animate-fade-in">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="text-blue-600 animate-pulse" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2">Analizando Accesibilidad</h3>
                <p className="text-slate-500 animate-pulse">Gemini está revisando contrastes y estructura...</p>
                <div className="flex gap-2 mt-4">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}

            {/* SECCIÓN RESULTADOS */}
            {result && (
              <div className="animate-fade-in-up pb-10">
                <button 
                  onClick={() => setResult(null)}
                  className="mb-6 text-slate-500 hover:text-blue-600 font-semibold flex items-center gap-2 transition-all hover:gap-3 group"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al inicio
                </button>

                <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-200 overflow-hidden">
                  
                  {/* Header Resultado */}
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Sparkles className="text-white" size={24} />
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

                  {/* Body Resultado */}
                  <div className="p-8 bg-gradient-to-b from-slate-50 to-white">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="text-orange-600" size={20} />
                      </div>
                      <h3 className="font-bold text-slate-800 text-xl">
                        {result.issues?.length || 0} Problemas Detectados
                      </h3>
                    </div>
                    
                    <div className="grid gap-4">
                      {result.issues?.map((issue: any, index: number) => (
                        <div key={index} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border-l-4 border-l-blue-500">
                          <div className="flex flex-col md:flex-row justify-between mb-4 gap-3">
                            <span className="font-bold text-slate-800 text-lg">{issue.element || 'Elemento General'}</span>
                            <span className={`self-start text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide ${
                              issue.severity === 'high' ? 'bg-red-100 text-red-700 border-2 border-red-200' : 
                              issue.severity === 'medium' ? 'bg-orange-100 text-orange-800 border-2 border-orange-200' : 
                              'bg-blue-100 text-blue-700 border-2 border-blue-200'
                            }`}>
                              {issue.severity === 'high' ? '🔴 Alta' : issue.severity === 'medium' ? '🟡 Media' : '🔵 Baja'}
                            </span>
                          </div>
                          
                          <p className="text-slate-600 mb-4 leading-relaxed">{issue.problem || issue.issue}</p>
                          
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 text-sm p-4 rounded-xl flex gap-3 items-start">
                            <CheckCircle size={20} className="mt-0.5 shrink-0 text-green-600" />
                            <div>
                              <span className="font-bold block mb-1 text-green-900">💡 Sugerencia de corrección:</span>
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

        {/* OTRAS PESTAÑAS (Renderizado Condicional) */}
        {activeTab === 'projects' && <MyProjects />}
        {activeTab === 'explore' && <Explore />}
        {activeTab === 'settings' && <Settings />}

      </main>
    </div>
  );
}

// Componente auxiliar para los botones del menú
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
      <span className={`relative z-10 ${active ? '' : 'group-hover:scale-110'} transition-transform`}>{icon}</span>
      <span className="relative z-10">{label}</span>
      {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"></div>}
    </button>
  );
}