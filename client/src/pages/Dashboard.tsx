import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Upload, 
  Link as LinkIcon, 
  LogOut, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  PlusCircle, 
  FolderOpen, 
  Globe, 
  Settings as SettingsIcon 
} from 'lucide-react';
import axios from 'axios';

// Importamos las otras vistas (Asegúrate de haber creado estos archivos antes)
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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* 1. SIDEBAR LATERAL */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-400 tracking-wider flex items-center gap-2">
            AXIO <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">BETA</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
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
          <div className="pt-4 mt-4 border-t border-slate-800">
            <SidebarItem 
              icon={<SettingsIcon size={20} />} 
              label="Configuración" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout} 
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 hover:bg-slate-800 w-full p-3 rounded-lg transition-all text-sm font-medium"
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 2. ÁREA PRINCIPAL */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative">
        
        {/* PESTAÑA: NUEVA AUDITORÍA */}
        {activeTab === 'new' && (
          <div className="p-8 max-w-6xl mx-auto min-h-full">
            
            {/* Cabecera de Bienvenida */}
            <header className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Hola, {user?.username} 👋</h2>
                <p className="text-slate-500 text-lg">¿Qué vamos a mejorar hoy?</p>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Plan Gratuito</p>
                <p className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">Actualizar a Pro</p>
              </div>
            </header>

            {/* SECCIÓN INPUTS (Solo si no hay resultado) */}
            {!result && !loading && (
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
                
                {/* Card URL */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all group">
                  <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <LinkIcon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Web en Vivo</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">
                    Introduce una URL pública. Nuestra IA navegará por ella, capturará la pantalla y analizará la accesibilidad y el diseño.
                  </p>
                  
                  <form onSubmit={handleUrlAnalyze} className="relative">
                    <input 
                      type="url" 
                      placeholder="https://ejemplo.com" 
                      className="w-full border border-gray-300 rounded-xl px-5 py-4 pr-24 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                    <button 
                      className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-lg font-medium transition-colors"
                    >
                      Analizar
                    </button>
                  </form>
                </div>

                {/* Card Archivo */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-purple-300 transition-all group">
                  <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Diseño o Documento</h3>
                  <p className="text-slate-500 mb-8 leading-relaxed">
                    Sube un mockup (JPG, PNG) o un PDF. Ideal para validar accesibilidad en fases de diseño (Shift-Left Testing).
                  </p>
                  
                  <label className="border-2 border-dashed border-slate-300 rounded-xl h-[54px] flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all group-hover:shadow-inner">
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,application/pdf" />
                    <span className="text-sm font-semibold text-slate-600 group-hover:text-purple-700 flex items-center gap-2">
                      <Upload size={16} /> Click para subir archivo
                    </span>
                  </label>
                </div>

              </div>
            )}

            {/* SECCIÓN LOADER */}
            {loading && (
              <div className="flex flex-col items-center justify-center h-[50vh] animate-fade-in">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2">Analizando Accesibilidad</h3>
                <p className="text-slate-500 animate-pulse">Gemini está revisando contrastes y estructura...</p>
              </div>
            )}

            {/* SECCIÓN RESULTADOS */}
            {result && (
              <div className="animate-fade-in-up pb-10">
                <button 
                  onClick={() => setResult(null)}
                  className="mb-6 text-slate-500 hover:text-blue-600 font-medium flex items-center gap-2 transition-colors"
                >
                  ← Volver al inicio
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                  
                  {/* Header Resultado */}
                  <div className="bg-slate-900 text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Resultado de Auditoría</h2>
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs uppercase tracking-wider">IA Powered</span>
                        <span>•</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm text-slate-400 uppercase tracking-widest font-semibold">Puntuación Global</div>
                        <div className="text-xs text-slate-500">Basado en WCAG 2.1</div>
                      </div>
                      <div className={`
                        h-20 w-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg border-4
                        ${result.score >= 80 ? 'bg-green-500 border-green-400' : result.score >= 50 ? 'bg-yellow-500 border-yellow-400' : 'bg-red-500 border-red-400'}
                      `}>
                        {result.score}
                      </div>
                    </div>
                  </div>

                  {/* Body Resultado */}
                  <div className="p-8 bg-slate-50">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg">
                      <AlertTriangle className="text-orange-500" /> 
                      {result.issues?.length || 0} Problemas Detectados
                    </h3>
                    
                    <div className="grid gap-4">
                      {result.issues?.map((issue: any, index: number) => (
                        <div key={index} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-500">
                          <div className="flex flex-col md:flex-row justify-between mb-3 gap-2">
                            <span className="font-bold text-slate-800 text-lg">{issue.element || 'Elemento General'}</span>
                            <span className={`self-start text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${
                              issue.severity === 'high' ? 'bg-red-100 text-red-700' : 
                              issue.severity === 'medium' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-700'
                            }`}>
                              Prioridad {issue.severity || 'Media'}
                            </span>
                          </div>
                          
                          <p className="text-slate-600 mb-4 leading-relaxed">{issue.problem || issue.issue}</p>
                          
                          <div className="bg-green-50 border border-green-100 text-green-800 text-sm p-4 rounded-xl flex gap-3 items-start">
                            <CheckCircle size={18} className="mt-0.5 shrink-0 text-green-600" />
                            <div>
                              <span className="font-bold block mb-1 text-green-900">Sugerencia de corrección:</span>
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

// Componente auxiliar para los botones del menú (Para que el código quede limpio)
function SidebarItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
        ${active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white hover:pl-5'}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}