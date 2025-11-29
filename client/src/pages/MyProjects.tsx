import { FolderOpen, Calendar, ArrowRight } from 'lucide-react';

// Datos de prueba (Mock Data) para ver cómo queda el diseño
// En el siguiente paso conectaremos esto con la Base de Datos real
const projects = [
  { id: 1, title: 'Web Corporativa', date: '12/12/2025', score: 85, type: 'url' },
  { id: 2, title: 'Diseño App Móvil', date: '10/12/2025', score: 42, type: 'file' },
];

export default function MyProjects() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FolderOpen className="text-blue-600" /> Mis Proyectos
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`text-sm font-bold px-2 py-1 rounded ${project.type === 'url' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {project.type.toUpperCase()}
              </div>
              <div className={`text-lg font-bold ${project.score > 80 ? 'text-green-500' : 'text-red-500'}`}>
                {project.score} pts
              </div>
            </div>
            
            <h3 className="font-bold text-slate-800 mb-1">{project.title}</h3>
            <div className="flex items-center gap-1 text-slate-400 text-sm mb-4">
              <Calendar size={14} /> {project.date}
            </div>

            <button className="w-full py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium flex items-center justify-center gap-2">
              Ver Reporte <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}