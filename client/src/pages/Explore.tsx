import { Globe, Heart, MessageSquare } from 'lucide-react';

export default function Explore() {
  return (
    <div className="p-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Explora la Comunidad 🌍</h1>
        <p className="text-slate-500">Descubre proyectos auditados y aprende de otros creadores</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Card de Ejemplo de Comunidad */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
            {/* Imagen del proyecto (placeholder) */}
            <div className="h-48 bg-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white font-medium">Ver Auditoría</span>
                </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800">E-commerce Accesible</h3>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">92/100</span>
              </div>
              <p className="text-slate-500 text-sm mb-4">Un diseño optimizado para lectores de pantalla...</p>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-400">
                <div className="flex items-center gap-1">
                    <Heart size={16} className="text-red-400" /> 12
                </div>
                <div className="flex items-center gap-1">
                    <MessageSquare size={16} /> 4 comentarios
                </div>
                <div className="font-medium text-slate-600">@usuario{i}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}