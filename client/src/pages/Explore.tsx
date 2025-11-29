import { Globe, Heart, MessageSquare, TrendingUp, Eye, Sparkles } from 'lucide-react';

const communityProjects = [
  {
    id: 1,
    title: 'E-commerce Accesible',
    description: 'Tienda online optimizada con navegación por teclado y alto contraste',
    score: 92,
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400&h=300&fit=crop',
    author: 'mariaperez',
    likes: 24,
    comments: 8,
    views: 156,
    tags: ['E-commerce', 'WCAG AA']
  },
  {
    id: 2,
    title: 'Dashboard Corporativo',
    description: 'Panel de control con soporte completo para lectores de pantalla',
    score: 88,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    author: 'juandev',
    likes: 31,
    comments: 12,
    views: 203,
    tags: ['Dashboard', 'Enterprise']
  },
  {
    id: 3,
    title: 'App Educativa',
    description: 'Plataforma de aprendizaje inclusiva con múltiples opciones de accesibilidad',
    score: 95,
    image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop',
    author: 'analucia',
    likes: 47,
    comments: 15,
    views: 289,
    tags: ['Educación', 'WCAG AAA']
  }
];

export default function Explore() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section con gradiente */}
      <div className="relative mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl"></div>
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="text-white" size={24} />
            </div>
            <Sparkles className="text-purple-500 animate-pulse" size={20} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            Explora la Comunidad
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Descubre proyectos destacados, aprende de las mejores prácticas y conecta con creadores comprometidos con la accesibilidad
          </p>
          
          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div className="flex items-center gap-2 text-slate-600">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <TrendingUp size={16} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium">+245 proyectos</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Heart size={16} className="text-red-500" />
              </div>
              <span className="text-sm font-medium">1.2k reacciones</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all">
          Todos
        </button>
        <button className="px-4 py-2 bg-white text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all border border-slate-200">
          Más Populares
        </button>
        <button className="px-4 py-2 bg-white text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all border border-slate-200">
          Recientes
        </button>
        <button className="px-4 py-2 bg-white text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all border border-slate-200">
          Puntuación Alta
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communityProjects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            {/* Image with overlay */}
            <div className="h-48 relative overflow-hidden bg-slate-200">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <div className="flex items-center gap-2 text-white text-sm font-medium">
                  <Eye size={16} />
                  <span>{project.views} visualizaciones</span>
                </div>
              </div>
              
              {/* Score Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl font-bold text-white shadow-lg backdrop-blur-sm ${
                project.score >= 90 ? 'bg-green-500/90' : 'bg-blue-500/90'
              }`}>
                {project.score}/100
              </div>
            </div>
            
            <div className="p-5">
              {/* Tags */}
              <div className="flex gap-2 mb-3">
                {project.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title & Description */}
              <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                {project.description}
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                    <Heart size={16} className="fill-current" />
                    <span className="font-medium">{project.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-colors cursor-pointer">
                    <MessageSquare size={16} />
                    <span className="font-medium">{project.comments}</span>
                  </div>
                </div>
                
                {/* Author */}
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {project.author.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    @{project.author}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all">
          Cargar más proyectos
        </button>
      </div>
    </div>
  );
}