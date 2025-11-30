import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext'; 
import { 
  Globe, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  Loader2,
  Link2,
  FileText,
  FileCode,
  Eye
} from 'lucide-react';

export default function Explore() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar qué filtro está activo
  const [filter, setFilter] = useState<'all' | 'popular' | 'recent' | 'score'>('all');
  
  const navigate = useNavigate();

  // 1. Cargar datos REALES de la comunidad
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

    // Actualizamos visualmente antes de que responda el servidor (para que se sienta rápido)
    setProjects(prev => prev.map(p => {
        if (p._id === projectId) {
            const isLiked = p.likes.includes(user?.id);
            return {
                ...p,
                likes: isLiked 
                    ? p.likes.filter((id: string) => id !== user?.id) // Quitar like
                    : [...p.likes, user?.id] // Añadir like
            };
        }
        return p;
    }));

    try {
      await api.put(`/projects/${projectId}/like`);
    } catch (error) {
      console.error("Error giving like:", error);
      // Aquí podrías revertir el cambio si falla
    }
  };

  // 3. Lógica de Ordenación y Filtrado
  const getFilteredProjects = () => {
    let sorted = [...projects]; // Copia para no mutar
    
    switch (filter) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'score':
        return sorted.sort((a, b) => (b.accessibilityScore || 0) - (a.accessibilityScore || 0));
      case 'popular':
        return sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      case 'all':
      default:
        return projects;
    }
  };

  const filteredProjects = getFilteredProjects();

  // FUNCIÓN PARA NAVEGAR ENVIANDO EL ESTADO DE ORIGEN
  const handleProjectClick = (id: string) => {
    navigate(`/project/${id}`, { state: { from: 'explore' } });
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
      <Loader2 className="animate-spin text-purple-600 h-10 w-10" />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Header Section con gradiente */}
      <div className="relative mb-12 overflow-hidden rounded-3xl shadow-sm border border-purple-100 dark:border-purple-900/50 animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-slate-700/50 dark:via-slate-800/50 dark:to-slate-900/50"></div>
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="text-white" size={24} />
            </div>
            <Sparkles className="text-purple-500 dark:text-purple-400 animate-pulse" size={20} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-3">
            Explora la Comunidad
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl">
            Descubre proyectos auditados por otros usuarios, inspírate y aprende de las mejores prácticas de accesibilidad.
          </p>
          
          {/* Stats dinámicos */}
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <div className="h-8 w-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                <TrendingUp size={16} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium">{projects.length} Proyectos activos</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <div className="h-8 w-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
                <Heart size={16} className="text-red-500" />
              </div>
              <span className="text-sm font-medium">
                {projects.reduce((acc, p) => acc + (p.likes?.length || 0), 0)} Likes totales
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all border ${
                filter === 'all' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
        >
          Todos
        </button>
        <button 
            onClick={() => setFilter('popular')}
            className={`px-4 py-2 rounded-xl font-medium transition-all border ${
                filter === 'popular' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
        >
          Más Populares
        </button>
        <button 
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 rounded-xl font-medium transition-all border ${
                filter === 'recent' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
        >
          Recientes
        </button>
        <button 
            onClick={() => setFilter('score')}
            className={`px-4 py-2 rounded-xl font-medium transition-all border ${
                filter === 'score' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
            }`}
        >
          Puntuación Alta
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {filteredProjects.map((project) => {
            const imageUrl = project.image 
                ? `http://localhost:3000/uploads/${project.image}`
                : null;
            
            const authorName = project.owner?.username || 'Anónimo';
            const initial = authorName.charAt(0).toUpperCase();
            const score = project.accessibilityScore || 0;
            
            // Verificar si YO le he dado like
            const isLiked = project.likes?.includes(user?.id);
            const likesCount = project.likes?.length || 0;

            let TypeIcon = Link2;
            if (project.type === 'file') TypeIcon = FileText;
            if (project.type === 'code') TypeIcon = FileCode;

            return (
              <div 
                key={project._id} 
                onClick={() => handleProjectClick(project._id)} 
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                {/* Image Header */}
                <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                  {imageUrl ? (
                     <img 
                       src={imageUrl} 
                       alt={project.title}
                       className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                     />
                  ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-400">
                        <TypeIcon size={48} className="mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-70">{project.type}</span>
                     </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Views Badge (Placeholder for future feature) */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white/90 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={14} />
                    <span>Vista previa</span>
                  </div>

                  <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl font-bold text-white shadow-lg backdrop-blur-sm ${
                    score >= 80 ? 'bg-green-500/90' : 
                    score >= 50 ? 'bg-yellow-500/90' : 'bg-red-500/90'
                  }`}>
                    {score}/100
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg font-medium uppercase">
                        {project.type}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-2 group-hover:text-purple-600 transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-mono bg-slate-50 dark:bg-slate-900 p-1.5 rounded mb-4 truncate border border-slate-100 dark:border-slate-700">
                    {project.input}
                  </p>
                  
                  {/* Footer Autor & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {initial}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        @{authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                      {/* LIKE BUTTON INTERACTIVO */}
                      <button 
                        onClick={(e) => handleLike(project._id, e)}
                        className={`flex items-center gap-1 transition-all px-2 py-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 ${
                            isLiked ? 'text-red-500 font-bold' : 'hover:text-red-500'
                        }`}
                        title={isLiked ? "Quitar Like" : "Dar Like"}
                      >
                        <Heart size={16} className={isLiked ? "fill-current" : ""} /> 
                        {likesCount}
                      </button>
                      
                      <div className="flex items-center gap-1 hover:text-blue-500 dark:hover:text-blue-400 transition">
                        <MessageSquare size={14} /> 0
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
      
      {/* Empty State */}
      {projects.length === 0 && !loading && (
         <div className="text-center py-20 text-slate-400 dark:text-slate-600">
            <Globe className="mx-auto mb-4 h-12 w-12 opacity-20" />
            <p>Aún no hay proyectos públicos. ¡Sé el primero en subir uno!</p>
         </div>
      )}
    </div>
  );
}