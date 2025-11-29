import { FolderOpen, Calendar, ArrowRight, TrendingUp, Link2, FileText, BarChart3, Filter } from 'lucide-react';

const projects = [
  { 
    id: 1, 
    title: 'Web Corporativa', 
    date: '12 Dic 2024', 
    score: 85, 
    type: 'url',
    issues: 12,
    status: 'completed',
    url: 'www.ejemplo.com'
  },
  { 
    id: 2, 
    title: 'Diseño App Móvil', 
    date: '10 Dic 2024', 
    score: 42, 
    type: 'file',
    issues: 28,
    status: 'needs-work',
    url: 'mockup-mobile.png'
  },
  { 
    id: 3, 
    title: 'Landing Page', 
    date: '8 Dic 2024', 
    score: 91, 
    type: 'url',
    issues: 7,
    status: 'completed',
    url: 'www.landing.com'
  },
];

export default function MyProjects() {
  const totalProjects = projects.length;
  const avgScore = Math.round(projects.reduce((acc, p) => acc + p.score, 0) / totalProjects);
  const totalIssues = projects.reduce((acc, p) => acc + p.issues, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      
      {/* Header with Stats */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <FolderOpen className="text-blue-600" size={24} />
              </div>
              Mis Proyectos
            </h1>
            <p className="text-slate-500">Gestiona y revisa tus auditorías de accesibilidad</p>
          </div>
          <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2">
            + Nueva Auditoría
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Total Proyectos</span>
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-blue-900">{totalProjects}</div>
            <div className="text-xs text-blue-600 mt-1">+2 este mes</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">Puntuación Media</span>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-900">{avgScore}/100</div>
            <div className="text-xs text-green-600 mt-1">↑ 5pts vs anterior</div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-orange-700">Issues Totales</span>
              <Filter className="text-orange-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-orange-900">{totalIssues}</div>
            <div className="text-xs text-orange-600 mt-1">{Math.round(totalIssues/totalProjects)} promedio/proyecto</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm shadow-lg shadow-blue-500/30">
          Todos
        </button>
        <button className="px-4 py-2 bg-white text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 border border-slate-200">
          URLs
        </button>
        <button className="px-4 py-2 bg-white text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 border border-slate-200">
          Archivos
        </button>
        <button className="px-4 py-2 bg-white text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50 border border-slate-200">
          Necesitan atención
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
          >
            {/* Header with gradient */}
            <div className={`h-2 ${
              project.score >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              project.score >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}></div>

            <div className="p-6">
              {/* Type Badge & Score */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    project.type === 'url' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'bg-purple-50 text-purple-600'
                  }`}>
                    {project.type === 'url' ? <Link2 size={16} /> : <FileText size={16} />}
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    project.type === 'url' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {project.type === 'url' ? 'URL' : 'ARCHIVO'}
                  </span>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    project.score >= 80 ? 'text-green-600' :
                    project.score >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {project.score}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">/ 100</div>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              
              {/* URL/Filename */}
              <p className="text-xs text-slate-500 mb-3 truncate">{project.url}</p>

              {/* Issues indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`h-2 flex-1 rounded-full bg-slate-100 overflow-hidden`}>
                  <div 
                    className={`h-full ${
                      project.issues > 20 ? 'bg-red-500' :
                      project.issues > 10 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((project.issues / 30) * 100, 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-slate-600">{project.issues} issues</span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4 pb-4 border-b border-slate-100">
                <Calendar size={14} />
                <span>{project.date}</span>
              </div>

              {/* Action Button */}
              <button className="w-full py-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl text-slate-600 hover:text-blue-600 text-sm font-semibold flex items-center justify-center gap-2 transition-all group-hover:shadow-md">
                Ver Reporte Completo 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (si no hay proyectos) */}
      {projects.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center h-20 w-20 bg-slate-100 rounded-full mb-4">
            <FolderOpen className="text-slate-400" size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No hay proyectos aún</h3>
          <p className="text-slate-500 mb-6">Comienza tu primera auditoría de accesibilidad</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all">
            Crear primer proyecto
          </button>
        </div>
      )}
    </div>
  );
}