import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useSocket } from '../context/SocketContext';
import PinLayer from '../components/collaboration/PinLayer';
import { 
  ArrowLeft, Sparkles, FileCode, Copy, 
  Loader2, Eye, EyeOff, Activity, MessageSquare, Zap, Send 
} from 'lucide-react';

export default function ProjectView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocket();
  
  const previousTab = location.state?.from || 'projects';

  // Estados de Datos
  const [project, setProject] = useState<any>(null);
  const [audit, setAudit] = useState<any>(null);
  const [pins, setPins] = useState<any[]>([]);
  const [codeContent, setCodeContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Estados de UI
  const [sidebarTab, setSidebarTab] = useState<'ai' | 'chat'>('ai');
  const [chatInput, setChatInput] = useState(''); // Nuevo estado para el input del chat
  
  // Estado del Motor de Empatía
  type FilterType = 'none' | 'blur' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  const [activeFilter, setActiveFilter] = useState<FilterType>('none');

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
                const fileRes = await fetch(`http://localhost:3000/uploads/${resProject.data.project.input}`);
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

    const handleNewPin = (newPin: any) => {
        setPins(prev => {
            const exists = prev.some(p => p._id === newPin._id);
            if (exists) return prev;
            return [...prev, newPin];
        });
    };

    socket.on('new_pin', handleNewPin);

    return () => {
        socket.off('new_pin', handleNewPin);
    };
  }, [socket, id]);

  // 3. Función para Guardar Pin (Visual o Chat)
  const handleSavePin = async (x: number, y: number, content: string) => {
    try {
        const res = await api.post('/pins', { projectId: id, x, y, content });
        const savedPin = res.data.data;
        
        setPins(prev => [...prev, savedPin]);
        socket?.emit('send_pin', { projectId: id, pin: savedPin });
        
        setSidebarTab('chat');
    } catch (e) { console.error(e); }
  };

  // Función para enviar mensaje desde la barra lateral (sin coordenadas)
  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    // Usamos coordenadas negativas para indicar que es un comentario global
    handleSavePin(-1, -1, chatInput);
    setChatInput('');
  };

  // Estilos Filtros
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
    navigate('/dashboard', { state: { tab: previousTab } });
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-900 text-white"><Loader2 className="animate-spin" /></div>;
  if (!project) return <div className="p-10 text-center text-red-500">Proyecto no encontrado</div>;

  const imageUrl = project.image ? `http://localhost:3000/uploads/${project.image}` : undefined;
  const isPdf = project.image?.toLowerCase().endsWith('.pdf');
  const showEmpathy = project.type !== 'code';

  // Filtramos los pines para la capa visual (solo los que tienen coordenadas positivas)
  const visualPins = pins.filter(p => p.x >= 0 && p.y >= 0);

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      
      {/* SVG Filters */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="protanopia-filter"><feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" /></filter>
          <filter id="deuteranopia-filter"><feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" /></filter>
          <filter id="tritanopia-filter"><feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" /></filter>
        </defs>
      </svg>

      {/* HEADER */}
      <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-6 shrink-0 z-20 shadow-lg">
        <div className="flex items-center gap-4">
            <button onClick={handleBack} className="hover:bg-slate-700 p-2 rounded-full transition"><ArrowLeft size={20} /></button>
            <div>
                <h1 className="font-bold text-lg">{project.title}</h1>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                   <span className="uppercase font-bold">{project.type}</span> • {new Date(project.createdAt).toLocaleDateString()}
                </div>
            </div>
        </div>
        
        {showEmpathy && (
            <div className="hidden md:flex items-center gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700">
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
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">IA Score</div>
                    <div className={`text-xl font-bold ${audit.score >= 80 ? 'text-green-400' : audit.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{audit.score}/100</div>
                </div>
            ) : (
                <div className="text-sm font-bold text-slate-300">Sin auditar</div>
            )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* CANVAS */}
        <main className="flex-1 bg-slate-950 relative overflow-auto flex items-center justify-center p-8 min-w-0">
            <div className="transition-all duration-500 relative shadow-2xl rounded-xl overflow-hidden w-full h-full flex items-center justify-center" style={showEmpathy ? getFilterStyle() : {}}>
                
                {/* CAPA DE PINES PARA IMÁGENES/WEB */}
                {/* Pasamos solo los pines visuales para que los comentarios de chat no floten en la esquina */}
                {showEmpathy && !isPdf && <PinLayer pins={visualPins} onSavePin={handleSavePin} />}

                {project.type === 'code' ? (
                    <div className="bg-slate-900 p-8 border border-slate-700 max-w-4xl w-full font-mono text-sm text-slate-300 flex flex-col max-h-[80vh]">
                        <div className="flex justify-between mb-4 border-b border-slate-700 pb-2 shrink-0">
                            <span className="text-emerald-400 flex gap-2"><FileCode /> {project.input}</span>
                            <button onClick={() => navigator.clipboard.writeText(codeContent)}><Copy size={16}/></button>
                        </div>
                         
                        {/* CÓDIGO CON PINES */}
                        <div className="flex-1 overflow-auto custom-scrollbar bg-[#0d1117] relative">
                            <div className="relative min-h-full min-w-full inline-block">
                                <PinLayer pins={visualPins} onSavePin={handleSavePin} />
                                <div className="p-6">
                                    <pre className="whitespace-pre"><code>{codeContent || "Cargando..."}</code></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : isPdf ? (
                    <div className="w-full h-full bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                         <iframe src={imageUrl} className="w-full h-full" title="Visor PDF" />
                    </div>
                ) : (
                    <img src={imageUrl} alt="Proyecto" className="max-h-[85vh] max-w-full object-contain block" />
                )}
            </div>
        </main>

        {/* SIDEBAR */}
        <aside className="w-96 bg-slate-900 border-l border-slate-700 flex flex-col shrink-0 z-10">
            <div className="flex border-b border-slate-700">
                <button 
                    onClick={() => setSidebarTab('ai')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'ai' ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-800' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <Zap size={16} /> Auditoría IA
                </button>
                <button 
                    onClick={() => setSidebarTab('chat')}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${sidebarTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-500 bg-slate-800' : 'text-slate-400 hover:bg-slate-800'}`}
                >
                    <MessageSquare size={16} /> Chat ({pins.length})
                </button>
            </div>

            {/* Contenido del Sidebar */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {sidebarTab === 'ai' && (
                    <div className="space-y-4">
                        {audit?.issues?.map((issue: any, idx: number) => (
                            <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
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
                                <div key={idx} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex gap-3 animate-fade-in-up">
                                    <div className="h-8 w-8 rounded-full bg-purple-900/50 text-purple-200 flex items-center justify-center text-xs font-bold shrink-0 border border-purple-500/30">
                                        {pin.author?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-bold text-slate-200">@{pin.author?.username}</span>
                                            <span className="text-[10px] text-slate-500">{new Date(pin.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed">{pin.content}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* INPUT CHAT (Solo visible en pestaña Chat) */}
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