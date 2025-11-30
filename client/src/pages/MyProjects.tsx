import { useEffect, useState } from 'react';
import api from '../services/api';
import { 
  FolderOpen, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Link2, 
  FileText, 
  FileCode, // Nuevo icono para código
  BarChart3, 
  Filter,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function MyProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Añadimos 'code' al filtro
  const [filter, setFilter] = useState<'all' | 'url' | 'file' | 'code'>('all');

  // 1. Cargar datos reales
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects'); 
        setProjects(res.data.data);
      } catch (err) {
        console.error("Error cargando proyectos:", err);
        setError('No se pudieron cargar tus proyectos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 2. Filtrar proyectos
  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.type === filter;
  });

  // 3. Calcular estadísticas reales
  const totalProjects = projects.length;
  const avgScore = totalProjects > 0 
    ? Math.round(projects.reduce((acc, p) => acc + (p.accessibilityScore || 0), 0) / totalProjects) 
    : 0;
  
  // Estimación visual de issues (ya que aún no guardamos el número exacto en el modelo Project)
  const estimatedIssues = projects.reduce((acc, p) => acc + Math.round((100 - (p.accessibilityScore || 0)) / 5), 0);

  if (loading) return (
    <div className="flex h-full items-center justify-center p-8 bg-slate-50">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 h-10 w-10 mx-auto mb-4" />
        <p className="text-slate-500">Cargando tu portafolio...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-full items-center justify-center p-8 text-red-500 gap-2">
      <AlertCircle /> {error}
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-50">
      
      {/* Header & Stats */}
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FolderOpen className="text-blue-600" size={24} />
              </div>
              Mis Proyectos
            </h1>
            <p className="text-slate-500">Gestiona y revisa tus auditorías</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Total</span>
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-blue-900">{totalProjects}</div>
            <div className="text-xs text-blue-600 mt-1">Auditorías realizadas</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Calidad Media</span>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-900">{avgScore}/100</div>
            <div className="text-xs text-green-600 mt-1">Puntuación global</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-700">Issues Estimados</span>
              <Filter className="text-orange-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-orange-900">{estimatedIssues}</div>
            <div className="text-xs text-orange-600 mt-1">Problemas detectados</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['all', 'url', 'file', 'code'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border capitalize ${
              filter === f 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'file' ? 'Diseños' : f === 'url' ? 'Webs' : 'Código'}
          </button>
        ))}
      </div>

      {/* Grid de Proyectos */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50">
          <FolderOpen className="text-slate-400 mb-4" size={40} />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No se encontraron proyectos</h3>
          <p className="text-slate-500">
            {filter === 'all' ? 'Aún no has guardado ninguna auditoría.' : `No hay proyectos de tipo "${filter}" guardados.`}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filteredProjects.map((project) => {
            const score = project.accessibilityScore || 0;
            const issuesCount = Math.round((100 - score) / 5);
            
            // Lógica de estilos según tipo
            let TypeIcon = Link2;
            let typeStyle = 'bg-blue-100 text-blue-700';
            let typeLabel = 'URL';

            if (project.type === 'file') {
                TypeIcon = FileText;
                typeStyle = 'bg-purple-100 text-purple-700';
                typeLabel = 'DISEÑO';
            } else if (project.type === 'code') {
                TypeIcon = FileCode;
                typeStyle = 'bg-emerald-100 text-emerald-700';
                typeLabel = 'CÓDIGO';
            }

            return (
              <div 
                key={project._id} 
                className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                {/* Header with gradient bar based on score */}
                <div className={`h-2 ${
                  score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                  score >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-red-500 to-pink-500'
                }`}></div>

                <div className="p-6">
                  {/* Type Badge & Score */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-opacity-20 ${typeStyle.split(' ')[0]}`}>
                        <TypeIcon size={16} className={typeStyle.split(' ')[1]} />
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${typeStyle}`}>
                        {typeLabel}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        score >= 80 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {score}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">/ 100</div>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-bold text-slate-800 text-lg mb-1 truncate group-hover:text-blue-600 transition-colors" title={project.title}>
                    {project.title}
                  </h3>
                  
                  {/* URL/Filename */}
                  <p className="text-xs text-slate-500 mb-4 truncate font-mono bg-slate-50 p-1.5 rounded border border-slate-100">
                    {project.input}
                  </p>

                  {/* Issues indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className={`h-full ${issuesCount > 10 ? 'bg-red-500' : issuesCount > 5 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${Math.min((issuesCount / 20) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600">~{issuesCount} issues</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-slate-400 text-sm mb-4 pb-4 border-b border-slate-100">
                    <Calendar size={14} />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Action Button */}
                  <button className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-slate-600 hover:text-blue-600 text-sm font-semibold flex items-center justify-center gap-2 transition-all group-hover:shadow-md">
                    Ver Reporte <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}