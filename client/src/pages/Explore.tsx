import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { uploadsUrl } from '../services/api';
import { useAuth } from '../context/AuthContext'; 
import { 
  Globe, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Loader2,
  Link2,
  FileText,
  FileCode,
  Eye,
  Star,
  BrainCircuit
} from 'lucide-react';

export default function Explore() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
   
  // Estado para controlar qué filtro está activo
  const [filter, setFilter] = useState<'all' | 'popular' | 'recent' | 'score' | 'rating'>('all');
   
  const navigate = useNavigate();

  // 1. Cargar datos REALES de la comunidad desde la Base de Datos
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await api.get('/projects/community');
        setProjects(res.data.data);
      } catch (error) {
        console.error("Error cargando comunidad:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunity();
  }, []);

  // 2. Lógica de Likes (Optimista)
  const handleLike = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita entrar al proyecto al dar like

    if (!user) return; 

    // Actualizo visualmente antes de que responda el servidor
    setProjects(prev => prev.map(p => {
        if (p._id === projectId) {
            const isLiked = p.likes.includes(user.id);
            return {
                ...p,
                likes: isLiked 
                    ? p.likes.filter((id: string) => id !== user.id) // Quitar like
                    : [...p.likes, user.id] // Añadir like
            };
        }
        return p;
    }));

    try {
      await api.put(`/projects/${projectId}/like`);
    } catch (error) {
      console.error("Error giving like:", error);
    }
  };

  // 3. Lógica de Votar (Rating) - Persistente y con datos del servidor
  const handleRate = async (projectId: string, rating: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    setProjects(prev => prev.map(p => {
        if (p._id === projectId) {
            return { ...p, myVote: rating }; // Marco visualmente tu voto
        }
        return p;
    }));

    try {
        // B) Guardo en BD
        const res = await api.put(`/projects/${projectId}/rate`, { rating });
        
        // C) Actualizo con los datos reales calculados por el servidor.
        setProjects(prev => prev.map(p => {
            if (p._id === projectId) {
                return {
                    ...p,
                    myVote: res.data.myVote,
                    averageRating: res.data.averageRating, // La media real de la BD
                    votesCount: res.data.votesCount        // El total real de votos
                };
            }
            return p;
        }));
    } catch (error) {
        console.error("Error rating project", error);
        alert("Error al guardar tu voto en la base de datos");
    }
  };

  // 4. Filtros y Ordenación
  const getFilteredProjects = () => {
    let sorted = [...projects]; 
    
    switch (filter) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'score': // Score de Accesibilidad (IA)
        return sorted.sort((a, b) => (b.accessibilityScore || 0) - (a.accessibilityScore || 0));
      case 'rating': // Voto de la Comunidad (Estrellas)
        return sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      case 'popular': // Likes
        return sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      case 'all':
      default:
        return projects;
    }
  };

  const filteredProjects = getFilteredProjects();

  const handleProjectClick = (id: string) => {
    navigate(`/project/${id}`, { state: { from: 'explore' } });
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center p-8 bg-white dark:bg-slate-900">
      <Loader2 className="animate-spin text-purple-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300 font-sans">
       
      {/* Header */}
      <div className="relative mb-12 overflow-hidden rounded-3xl shadow-sm border border-purple-100 dark:border-purple-900/50 animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-700/50 dark:via-slate-800/50 dark:to-slate-900/50"></div>
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="text-white" size={24} />
            </div> 
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-3">
            Explora la Comunidad
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl">
            Descubre proyectos auditados por Axio, inspírate y ayuda a la comunidad puntuando sus aportes.
          </p>
           
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-purple-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
              <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
              <span>{projects.length} Proyectos activos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-purple-100 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100">
              <Heart size={16} className="text-red-500" />
              <span>{projects.reduce((acc, p) => acc + (p.likes?.length || 0), 0)} Likes totales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
            { id: 'all', label: 'Todos' },
            { id: 'popular', label: 'Más Likes' },
            { id: 'rating', label: 'Mejor Valorados ⭐' },
            { id: 'recent', label: 'Recientes' },
            { id: 'score', label: 'IA Score' }
        ].map((btn) => (
            <button 
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`px-4 py-2 rounded-xl font-medium transition-all border ${
                    filter === btn.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                }`}
            >
            {btn.label}
            </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filteredProjects.map((project) => {
            const mediaSource = project.image || (project.type !== 'code' ? project.input : null);
            const imageUrl = mediaSource ? uploadsUrl(mediaSource) : null;
            
            // Detección de PDF
            const isPdf = mediaSource?.toLowerCase().endsWith('.pdf');

            const authorName = project.owner?.username || 'Anónimo';
            const initial = authorName.charAt(0).toUpperCase();
            const aiScore = project.accessibilityScore;
            
            const isLiked = project.likes?.includes(user?.id);
            
            const communityRating = project.averageRating || 0;
            const myVote = project.myVote || 0;
            const totalVotes = project.votesCount || 0;

            let TypeIcon = Link2;
            if (project.type === 'file') TypeIcon = FileText;
            if (project.type === 'code') TypeIcon = FileCode;

            return (
              <div 
                key={project._id} 
                onClick={() => handleProjectClick(project._id)} 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col"
              >
                {/* Imagen / Header */}
                <div className="h-64 relative overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0">
                  {imageUrl && !isPdf ? (
                      // CASO 1: Imagen normal
                      <img 
                        src={imageUrl} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                  ) : isPdf && imageUrl ? (
                      // CASO 2: PDF - Vista previa con iframe ampliado SIN SCROLL
                      <div className="w-full h-full overflow-hidden relative">
                        <iframe 
                          src={imageUrl} 
                          className="absolute pointer-events-none border-0"
                          title={project.title}
                          style={{ 
                            width: '140%', 
                            height: '140%', 
                            transform: 'scale(1)',
                            transformOrigin: 'top left',
                            left: '-33%',
                            top: '-35%'
                          }}
                        />
                      </div>
                  ) : (
                      // CASO 3: Placeholder genérico
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400">
                        <TypeIcon size={56} className="mb-2 opacity-50" />
                        <span className="text-sm font-bold uppercase tracking-widest opacity-70">{project.type}</span>
                      </div>
                  )}
                   
                  {/* Overlay oscuro solo para imágenes reales, no PDFs */}
                  {!isPdf && imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  )}
                   
                  {/* Badge "Vista previa" */}
                  <div className={`absolute bottom-4 left-4 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isPdf ? 'text-slate-700 dark:text-slate-300 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-lg' : 'text-white/90'}`}>
                    <Eye size={14} />
                    <span>Vista previa</span>
                  </div>

                  {/* Badge Score IA - Solo si está analizado */}
                  {project.status === 'analyzed' && aiScore !== null && aiScore !== undefined && (
                      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl font-bold text-white shadow-lg backdrop-blur-sm flex items-center gap-1.5 ${
                        aiScore >= 80 ? 'bg-green-500/90' : 
                        aiScore >= 50 ? 'bg-yellow-500/90' : 'bg-red-500/90'
                      }`}>
                        <BrainCircuit size={14} />
                        {aiScore}
                      </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium uppercase">
                        {project.type}
                    </span>
                    {project.isFeatured && (
                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-lg font-medium uppercase flex items-center gap-1">
                        <Star size={12} className="text-blue-600 dark:text-blue-300" />
                        Destacado
                      </span>
                    )}
                    {isPdf && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-2 py-1 rounded-lg font-medium uppercase">
                        PDF
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2 group-hover:text-purple-600 transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-mono bg-slate-50 dark:bg-slate-900 p-1.5 rounded mb-4 truncate border border-slate-100 dark:border-slate-700">
                    {project.input}
                  </p>
                   
                  {/* SISTEMA DE VOTACIÓN */}
                  <div className="mt-auto mb-4 bg-slate-50 dark:bg-slate-700/30 p-3 rounded-xl">
                      <div className="flex items-center justify-between text-xs mb-2">
                         <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                            <Star size={12} className="text-yellow-500 fill-yellow-500" />
                            {communityRating > 0 ? communityRating.toFixed(1) : 'Sin votos'}
                            <span className="font-normal text-slate-400 ml-1">({totalVotes})</span>
                         </span>
                         {myVote > 0 && <span className="text-blue-500 font-bold text-[10px] uppercase">Tu voto: {myVote}</span>}
                      </div>
                      
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={(e) => handleRate(project._id, star, e)}
                                className="focus:outline-none transition-transform hover:scale-110 active:scale-95 p-0.5"
                                title={`Puntuar ${star} estrellas`}
                            >
                                <Star 
                                    size={18} 
                                    className={`${
                                        (myVote ? star <= myVote : star <= Math.round(communityRating))
                                        ? "fill-yellow-400 text-yellow-400" 
                                        : "text-slate-300 dark:text-slate-600 hover:text-yellow-200"
                                    } transition-colors`} 
                                />
                            </button>
                          ))}
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/u/${project.owner?.username || authorName}`); }}>
                        <div className="h-7 w-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                          {project.owner?.avatar ? (
                            <img src={uploadsUrl(project.owner.avatar)} alt={authorName} className="w-full h-full object-cover" />
                          ) : (
                            initial
                          )}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          @{authorName}
                        </span>
                      </div>

                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                      <button 
                        onClick={(e) => handleLike(project._id, e)}
                        className={`flex items-center gap-1 transition-all px-2 py-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 ${
                            isLiked ? 'text-red-500 font-bold' : 'hover:text-red-500'
                        }`}
                        title={isLiked ? "Quitar Like" : "Dar Like"}
                      >
                        <Heart size={16} className={isLiked ? "fill-current" : ""} /> 
                        {project.likes?.length || 0}
                      </button>
                      
                      <div className="flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        <MessageSquare size={14} /> {project.commentsCount || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
      </div>

      {/* Estado vacío */}
      {projects.length === 0 && !loading && (
         <div className="text-center py-20 text-slate-400 dark:text-slate-600">
            <Globe className="mx-auto mb-4 h-12 w-12 opacity-20" />
            <p>Aún no hay proyectos públicos. ¡Sé el primero en subir uno!</p>
         </div>
      )}
    </div>
  );
}