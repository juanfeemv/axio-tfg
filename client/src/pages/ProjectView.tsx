import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  ArrowLeft, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles, 
  FileCode, 
  Copy, 
  Eye, 
  EyeOff, 
  Activity 
} from 'lucide-react';

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados de datos
  const [project, setProject] = useState<any>(null);
  const [audit, setAudit] = useState<any>(null);
  const [codeContent, setCodeContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Estado del Motor de Empatía
  type FilterType = 'none' | 'blur' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  const [activeFilter, setActiveFilter] = useState<FilterType>('none');

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        const projectData = res.data.project;
        setProject(projectData);
        setAudit(res.data.audit);

        if (projectData.type === 'code' && projectData.input) {
            try {
                const fileResponse = await fetch(`http://localhost:3000/uploads/${projectData.input}`);
                if (fileResponse.ok) {
                    const text = await fileResponse.text();
                    setCodeContent(text);
                }
            } catch (err) { console.error(err); }
        }
      } catch (error) {
        console.error("Error cargando proyecto:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // Estilos dinámicos para los filtros
  const getFilterStyle = () => {
    switch (activeFilter) {
      case 'blur': return { filter: 'blur(4px)' };
      case 'achromatopsia': return { filter: 'grayscale(100%)' };
      case 'protanopia': return { filter: 'url(#protanopia-filter)' };
      case 'deuteranopia': return { filter: 'url(#deuteranopia-filter)' };
      case 'tritanopia': return { filter: 'url(#tritanopia-filter)' };
      default: return {};
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
            <Sparkles className="mb-4 h-8 w-8 text-blue-500" />
            Cargando entorno...
        </div>
    </div>
  );

  if (!project) return <div className="min-h-screen bg-slate-900 text-red-500 p-10">Proyecto no encontrado</div>;

  const imageUrl = project.image ? `http://localhost:3000/uploads/${project.image}` : null;
  
  const showEmpathyEngine = project.type !== 'code';

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
          </filter>
        </defs>
      </svg>

      <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-20 shadow-lg">
        <div className="flex items-center gap-4">
          {/* CAMBIO AQUÍ: Enviamos el estado 'tab: projects' al navegar */}
          <button 
            onClick={() => navigate('/dashboard', { state: { tab: 'projects' } })} 
            className="hover:bg-slate-700 p-2 rounded-full transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-lg leading-tight truncate max-w-md">{project.title}</h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className={`px-1.5 py-0.5 rounded uppercase font-bold ${
                    project.type === 'url' ? 'bg-blue-900 text-blue-200' : 
                    project.type === 'file' ? 'bg-purple-900 text-purple-200' : 
                    'bg-emerald-900 text-emerald-200'
                }`}>
                    {project.type}
                </span>
                <span>• {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        {showEmpathyEngine && (
            <div className="items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700 hidden md:flex">
                <FilterButton label="Normal" active={activeFilter === 'none'} onClick={() => setActiveFilter('none')} icon={<Eye size={14} />} />
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <FilterButton label="Borroso" active={activeFilter === 'blur'} onClick={() => setActiveFilter('blur')} icon={<EyeOff size={14} />} />
                <FilterButton label="Grises" active={activeFilter === 'achromatopsia'} onClick={() => setActiveFilter('achromatopsia')} icon={<Activity size={14} />} />
                <FilterButton label="Protanopia" active={activeFilter === 'protanopia'} onClick={() => setActiveFilter('protanopia')} />
                <FilterButton label="Deuteranopia" active={activeFilter === 'deuteranopia'} onClick={() => setActiveFilter('deuteranopia')} />
            </div>
        )}

        <div className="flex items-center gap-4">
            {audit ? (
                <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Puntuación IA</div>
                    <div className={`text-xl font-bold ${
                        audit.score >= 80 ? 'text-green-400' : 
                        audit.score >= 50 ? 'text-yellow-400' : 
                        'text-red-400'
                    }`}>
                        {audit.score}/100
                    </div>
                </div>
            ) : (
                <div className="text-right">
                     <div className="text-[10px] uppercase tracking-wider text-slate-400">Estado</div>
                     <div className="text-sm font-bold text-slate-300">Sin auditar</div>
                </div>
            )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 bg-slate-950 relative overflow-auto flex items-center justify-center p-8 min-w-0">
            <div 
                className="transition-all duration-500 ease-in-out relative shadow-2xl rounded-xl overflow-hidden"
                style={showEmpathyEngine ? getFilterStyle() : {}}
            >
                {project.type === 'url' && imageUrl ? (
                    <div className="border-8 border-slate-800 max-w-5xl w-full">
                        <img src={imageUrl} alt="Captura Web" className="w-full h-auto block" />
                    </div>
                ) : project.type === 'file' && imageUrl ? (
                    <div>
                        <img src={imageUrl} alt="Diseño Subido" className="max-h-[85vh] max-w-full object-contain" />
                    </div>
                ) : project.type === 'code' ? (
                    <div className="bg-slate-900 p-8 border border-slate-700 max-w-4xl w-full font-mono text-sm text-slate-300 flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <FileCode className="text-emerald-400" size={18} />
                                <span className="text-slate-200">{project.title}</span>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(codeContent)} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Copiar">
                                <Copy size={16} />
                            </button>
                        </div>
                        <div className="p-6 overflow-auto custom-scrollbar bg-[#0d1117]">
                            <pre><code>{codeContent || "Cargando código..."}</code></pre>
                        </div>
                    </div>
                ) : (
                    <div className="text-slate-500 flex flex-col items-center p-10 bg-slate-900/50 rounded-xl border border-slate-800">
                        <AlertTriangle size={48} className="mb-4 opacity-50" />
                        <p>No hay previsualización disponible</p>
                    </div>
                )}
            </div>

            {showEmpathyEngine && activeFilter !== 'none' && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm animate-bounce pointer-events-none z-30">
                    👁️ Modo Simulación: {activeFilter.toUpperCase()}
                </div>
            )}
        </main>

        <aside className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col shrink-0 z-10">
            <div className="p-4 border-b border-slate-800 bg-slate-900">
                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-orange-400" /> 
                    Problemas Detectados ({audit?.issues?.length || 0})
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {audit && audit.issues && audit.issues.length > 0 ? (
                    audit.issues.map((issue: any, idx: number) => (
                        <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all group">
                            <div className="flex justify-between items-start mb-2 gap-2">
                                <span className="text-sm font-bold text-blue-200 break-words">{issue.element || 'Elemento'}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wide shrink-0 ${
                                    issue.severity === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 
                                    issue.severity === 'medium' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 
                                    'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                }`}>
                                    {issue.severity || 'info'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400 mb-3 leading-relaxed">{issue.problem || issue.issue}</p>
                            <div className="bg-green-900/20 border border-green-900/30 p-3 rounded text-xs text-green-300 flex gap-2">
                                <Sparkles size={14} className="shrink-0 mt-0.5 text-green-400" />
                                {issue.suggestion}
                            </div>
                        </div>
                    ))
                ) : (
                     <div className="text-center py-10 text-slate-500 px-4">
                        {audit ? (
                            <>
                                <CheckCircle className="mx-auto mb-2 h-10 w-10 text-green-500/50" />
                                <p>¡Todo parece correcto! No se han detectado problemas graves.</p>
                            </>
                        ) : (
                            <>
                                <Sparkles className="mx-auto mb-2 h-10 w-10 text-slate-600" />
                                <p>Este proyecto no tiene auditoría IA asociada.</p>
                            </>
                        )}
                     </div>
                )}
            </div>
        </aside>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick, icon }: any) {
    return (
        <button 
            onClick={onClick}
            className={`
                px-3 py-1.5 rounded text-xs font-medium transition-all flex items-center gap-2
                ${active 
                    ? 'bg-blue-600 text-white shadow-sm scale-105' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
            `}
            title={`Activar filtro: ${label}`}
        >
            {icon} {label}
        </button>
    )
}