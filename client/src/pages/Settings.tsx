import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Configuración</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Sección Perfil */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
            <User size={20} /> Perfil Público
          </h2>
          <div className="flex gap-4 items-center">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-slate-800">{user?.username}</p>
              <p className="text-slate-500 text-sm">{user?.email}</p>
            </div>
            <button className="ml-auto text-blue-600 text-sm font-medium hover:underline">
              Cambiar foto
            </button>
          </div>
        </div>

        {/* Sección Opciones */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Bell className="text-slate-400" />
              <div>
                <p className="font-medium text-slate-700">Notificaciones por Email</p>
                <p className="text-xs text-slate-500">Recibe el PDF al terminar una auditoría</p>
              </div>
            </div>
            <input type="checkbox" className="toggle" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Shield className="text-slate-400" />
              <div>
                <p className="font-medium text-slate-700">Modo Estricto (WCAG AAA)</p>
                <p className="text-xs text-slate-500">Análisis más exigente</p>
              </div>
            </div>
            <input type="checkbox" className="toggle" />
          </div>
        </div>

      </div>
    </div>
  );
}