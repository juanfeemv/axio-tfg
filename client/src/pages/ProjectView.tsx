import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api, { uploadsUrl } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import PinLayer from '../components/collaboration/PinLayer';
import { 
  ArrowLeft, Sparkles, FileCode, Copy, 
  Loader2, Eye, EyeOff, Activity, MessageSquare, Zap, Send, Trash2 
} from 'lucide-react';

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  const { user } = useAuth();
  
    const previousTab = location.state?.from || 'projects';

  // Estados de Datos
  const [project, setProject] = useState<any>(null);
  const [audit, setAudit] = useState<any>(null);
  const [pins, setPins] = useState<any[]>([]);
  const [codeContent, setCodeContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Estados de UI
  const [sidebarTab, setSidebarTab] = useState<'ai' | 'chat'>('ai');
  const [chatInput, setChatInput] = useState('');
  
  // Estado del Motor de Empatía
  type FilterType = 'none' | 'blur' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  const [activeFilter, setActiveFilter] = useState<FilterType>('none');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 1. Carga Inicial de Datos
  useEffect(() => {
    const loadData = async () => {
      try {
        const resProject = await api.get(`/projects/${id}`);
        setProject(resProject.data.project);
        setAudit(resProject.data.audit);

        const resPins = await api.get(`/pins/${id}`);
        setPins(resPins.data.data);

        if (resProject.data.project.type === 'code' && resProject.data.project.input) {
            try {
                const fileRes = await fetch(uploadsUrl(resProject.data.project.input));
                if (fileRes.ok) setCodeContent(await fileRes.text());
            } catch (err) { console.error(err); }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  // 2. Conexión Tiempo Real (WebSockets)
  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('join_project', id);

    // Nuevo Pin
    const handleNewPin = (newPin: any) => {
        setPins(prev => {
            const exists = prev.some(p => p._id === newPin._id);
            if (exists) return prev;
            return [...prev, newPin];
        });
        if(sidebarTab !== 'chat') setSidebarTab('chat');
    };

    // Pin Borrado
    const handlePinDeleted = ({ pinId }: { pinId: string }) => {
        setPins(prev => prev.filter(p => p._id !== pinId));
    };

    socket.on('new_pin', handleNewPin);
    socket.on('pin_deleted', handlePinDeleted);

    return () => {
        socket.off('new_pin', handleNewPin);
        socket.off('pin_deleted', handlePinDeleted);
    };
  }, [socket, id, sidebarTab]);

  // 3. Funciones de Acción
  const handleSavePin = async (x: number, y: number, content: string) => {
    try {
        const res = await api.post('/pins', { projectId: id, x, y, content });
        const savedPin = res.data.data;
        
        setPins(prev => [...prev, savedPin]);
        socket?.emit('send_pin', { projectId: id, pin: savedPin });
        
        setSidebarTab('chat');
    } catch (e) { console.error(e); }
  };

  // Función Borrar Pin
  const handleDeletePin = async (pinId: string) => {
    try {
        await api.delete(`/pins/${pinId}`);
        setPins(prev => prev.filter(p => p._id !== pinId));
        socket?.emit('delete_pin', { projectId: id, pinId });
    } catch (error) {
        console.error("Error deleting pin:", error);
        alert("No se pudo borrar el comentario");
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    handleSavePin(-1, -1, chatInput);
    setChatInput('');
  };

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

    const handleBack = () => {
        if (previousTab === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard', { state: { tab: previousTab } });
        }
    };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white"><Loader2 className="animate-spin" /></div>;
  if (!project) return <div className="p-10 text-center text-red-500">Proyecto no encontrado</div>;

        const mediaSource = project.image || (project.type !== 'code' ? project.input : undefined);
        const imageUrl = mediaSource ? uploadsUrl(mediaSource) : undefined;
    const isPdf = mediaSource?.toLowerCase().endsWith('.pdf');
  const showEmpathy = project.type !== 'code';
  const visualPins = pins.filter(p => p.x >= 0 && p.y >= 0);

  const canDelete = (pin: any) => {
    if (!user || !pin.author) return false;
    const authorId = pin.author._id || pin.author; 
    return authorId === user.id || project.owner === user.id;
  };

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      
      {/* SVG Fitlros */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="protanopia-filter"><feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" /></filter>
          <filter id="deuteranopia-filter"><feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" /></filter>
          <filter id="tritanopia-filter"><feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" /></filter>
        </defs>
      </svg>

      {/* HEADER */}
      <header className="h-12 md:h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-2 md:px-6 shrink-0 z-20 shadow-lg gap-1 md:gap-2">
        <div className="flex items-center gap-1 md:gap-4 min-w-0 flex-1">
            <button onClick={handleBack} className="hover:bg-slate-700 p-1.5 md:p-2 rounded-full transition shrink-0"><ArrowLeft size={18} /></button>
             <div className="min-w-0 flex-1">
                <h1 className="font-bold text-sm md:text-lg truncate">{project.title}</h1>
                <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-slate-400">
                   <span className="uppercase font-bold">{project.type}</span>
                   {project.owner && project.owner.username && (
                     <Link 
                       to={`/u/${project.owner.username}`}
                       className="flex items-center gap-1 hover:text-blue-400 transition-colors truncate"
                     >
                       <span className="hidden sm:inline">•</span>
                       {project.owner.avatar ? (
                         <img src={uploadsUrl(project.owner.avatar)} alt="" className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full object-cover shrink-0" />
                       ) : (
                         <div className="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-slate-700 flex items-center justify-center text-[8px] md:text-[10px] shrink-0">
                           {project.owner.username.charAt(0).toUpperCase()}
                         </div>
                       )}
                       <span className="font-medium truncate">@{project.owner.username}</span>
                     </Link>
                   )}
                </div>
             </div>
        </div>
        
        {showEmpathy && (
            <div className="hidden md:flex items-center gap-1 md:gap-2 bg-slate-900 p-0.5 md:p-1 rounded-lg border border-slate-700 shrink-0">
                <FilterButton label="Normal" active={activeFilter === 'none'} onClick={() => setActiveFilter('none')} icon={<Eye size={14} />} />
                <div className="w-px h-4 bg-slate-700 mx-0.5 md:mx-1"></div>
                <FilterButton label="Borroso" active={activeFilter === 'blur'} onClick={() => setActiveFilter('blur')} icon={<EyeOff size={14} />} />
                <FilterButton label="Grises" active={activeFilter === 'achromatopsia'} onClick={() => setActiveFilter('achromatopsia')} icon={<Activity size={14} />} />
                <FilterButton label="Protanopia" active={activeFilter === 'protanopia'} onClick={() => setActiveFilter('protanopia')} />
                <FilterButton label="Deuteranopia" active={activeFilter === 'deuteranopia'} onClick={() => setActiveFilter('deuteranopia')} />
            </div>
        )}

        <div className="flex items-center gap-1.5 md:gap-4 shrink-0">
            {audit ? (
                <div className="text-right">
                    <div className="text-[8px] md:text-[10px] uppercase tracking-wider text-slate-400">Score</div>
                    <div className={`text-sm md:text-xl font-bold ${audit.score >= 80 ? 'text-green-400' : audit.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{audit.score}/100</div>
                </div>
            ) : (
                <div className="text-xs md:text-sm font-bold text-slate-300 hidden sm:block">Sin auditar</div>
            )}
            <button
              className="md:hidden h-8 w-8 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition shrink-0"
              onClick={() => setMobileSidebarOpen(v => !v)}
              aria-label="Ver auditoría y comentarios"
            >
              <MessageSquare size={16} />
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
         {/* CANVAS PRINCIPAL */}
        <main className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-1.5 md:p-6 min-w-0 min-h-0">
            {/* Filtros de empatía en móvil: scroll horizontal compacto */}
            {showEmpathy && (
              <div className="md:hidden w-full flex items-center gap-1 overflow-x-auto pb-1 shrink-0 scrollbar-none px-0.5">
                <FilterButton label="Normal" active={activeFilter === 'none'} onClick={() => setActiveFilter('none')} icon={<Eye size={12} />} />
                <FilterButton label="Borroso" active={activeFilter === 'blur'} onClick={() => setActiveFilter('blur')} icon={<EyeOff size={12} />} />
                <FilterButton label="Grises" active={activeFilter === 'achromatopsia'} onClick={() => setActiveFilter('achromatopsia')} icon={<Activity size={12} />} />
                <FilterButton label="Protanopia" active={activeFilter === 'protanopia'} onClick={() => setActiveFilter('protanopia')} />
                <FilterButton label="Deuteranopia" active={activeFilter === 'deuteranopia'} onClick={() => setActiveFilter('deuteranopia')} />
              </div>
            )}
            <div className="transition-all duration-500 relative shadow-2xl rounded-lg md:rounded-xl overflow-hidden w-full flex-1 flex items-center justify-center min-h-0" style={showEmpathy ? getFilterStyle() : {}}>
                
                {showEmpathy && !isPdf && <PinLayer pins={visualPins} onSavePin={handleSavePin} />}

                {project.type === 'code' ? (
                    <div className="bg-[#0d1117] border border-slate-700 w-full h-full font-mono text-sm text-slate-300 flex flex-col rounded-xl overflow-hidden">
                        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700 bg-slate-900 shrink-0">
                            <span className="text-emerald-400 flex gap-2 items-center font-semibold">
                                <FileCode size={18} /> 
                                {project.input}
                            </span>
                            <button 
                                onClick={() => navigator.clipboard.writeText(codeContent)}
                                className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                                title="Copiar código"
                            >
                                <Copy size={16}/>
                            </button>
                        </div>
                          
                        <div className="flex-1 overflow-auto custom-scrollbar relative">
                            <div className="relative min-h-full min-w-max inline-block">
                                <PinLayer pins={visualPins} onSavePin={handleSavePin} />
                                <div className="p-6">
                                    <pre className="whitespace-pre font-mono text-sm leading-relaxed">
                                        <code>{codeContent || "Cargando..."}</code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isPdf ? (
                    <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                         <iframe src={imageUrl} className="w-full h-full" title="Visor PDF" />
                    </div>
                ) : (
                    <div className="w-full h-full overflow-auto custom-scrollbar flex items-center justify-center bg-slate-950/50">
                         <img
                           src={imageUrl}
                           alt="Proyecto"
                           className="max-w-full max-h-full object-contain shadow-lg"
                         />
                    </div>
                )}
            </div>
        </main>

        {/* SIDEBAR — escritorio: lateral fija | móvil: panel inferior deslizante */}
        {/* Overlay móvil */}
        {mobileSidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        <aside className={`
          fixed md:relative bottom-0 left-0 right-0 md:bottom-auto md:left-auto md:right-auto
          md:w-96 bg-slate-900 border-t md:border-t-0 md:border-l border-slate-700
          flex flex-col shrink-0 z-40 md:z-10 shadow-xl
          transition-transform duration-300 ease-in-out
          ${mobileSidebarOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
          h-[70vh] md:h-auto
        `}>
            <div className="flex border-b border-slate-700 bg-slate-900">
                <button 
                    onClick={() => setSidebarTab('ai')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${sidebarTab === 'ai' ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-800' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <Zap size={16} /> Auditoría IA
                </button>
                <button 
                    onClick={() => setSidebarTab('chat')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all ${sidebarTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-800' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                    <MessageSquare size={16} /> Chat ({pins.length})
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {sidebarTab === 'ai' && (
                    <div className="space-y-4">
                        {audit?.issues?.map((issue: any, idx: number) => (
                            <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 animate-fade-in">
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-bold text-blue-200">{issue.element}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${issue.severity === 'high' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>{issue.severity}</span>
                                </div>
                                <p className="text-sm text-slate-400 mb-2">{issue.problem}</p>
                                <div className="text-xs text-green-300 bg-green-900/20 p-2 rounded flex gap-2">
                                    <Sparkles size={12} className="shrink-0 mt-0.5" /> {issue.suggestion}
                                </div>
                            </div>
                        ))}
                        {!audit && <div className="text-center text-slate-500 py-10">Sin datos de IA</div>}
                    </div>
                )}

                {sidebarTab === 'chat' && (
                    <div className="space-y-4">
                        {pins.length === 0 ? (
                            <div className="text-center text-slate-500 py-10 px-4">
                                <MessageSquare className="mx-auto mb-3 h-10 w-10 opacity-20" />
                                <p>No hay comentarios aún.</p>
                                <p className="text-xs mt-2">Haz clic en la imagen para poner un pin o escribe abajo.</p>
                            </div>
                        ) : (
                            pins.map((pin, idx) => (
                                <div key={idx} className="group bg-slate-800 p-3 rounded-xl border border-slate-700 flex gap-3 animate-fade-in-up hover:border-slate-600 transition-colors">
                                    <Link to={`/u/${pin.author?.username || '#'}`} className="shrink-0">
                                      {pin.author?.avatar ? (
                                        <img src={uploadsUrl(pin.author.avatar)} alt="" className="h-8 w-8 rounded-full object-cover border border-slate-600" />
                                      ) : (
                                        <div className="h-8 w-8 rounded-full bg-purple-900/50 text-purple-200 flex items-center justify-center text-xs font-bold border border-purple-500/30">
                                            {pin.author?.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                      )}
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                  to={`/u/${pin.author?.username || '#'}`}
                                                  className="text-sm font-bold text-slate-200 hover:text-blue-400 transition-colors"
                                                >
                                                  @{pin.author?.username || 'Usuario desconocido'}
                                                </Link>
                                                <span className="text-[10px] text-slate-500">{new Date(pin.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                            
                                            {canDelete(pin) && (
                                                <button 
                                                    onClick={() => handleDeletePin(pin._id)}
                                                    className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1 hover:bg-slate-700/50 rounded"
                                                    title="Borrar comentario"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed break-words">{pin.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {sidebarTab === 'chat' && (
                <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0">
                    <div className="relative flex items-center gap-2">
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2.5 pl-3 pr-10 text-sm focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder:text-slate-500"
                            placeholder="Escribe un comentario general..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        />
                        <button 
                            onClick={handleSendChat}
                            className="absolute right-2 p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            )}
        </aside>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick, icon }: any) {
    return (
        <button onClick={onClick} className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-all ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
            {icon} {label}
        </button>
    );
}