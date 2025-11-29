import { useState } from 'react';
import { User, Shield, Bell, Mail, Lock, Palette, Zap, Save, Camera } from 'lucide-react';

export default function Settings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [strictMode, setStrictMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  // Mock user data
  const user = {
    username: 'juandev',
    email: 'juan@ejemplo.com'
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Shield className="text-purple-600" size={24} />
          </div>
          Configuración
        </h1>
        <p className="text-slate-500">Personaliza tu experiencia en Axio</p>
      </div>

      <div className="space-y-6">
        
        {/* PERFIL CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              Perfil Público
            </h2>
            <p className="text-sm text-slate-500 mt-1">Esta información será visible para otros usuarios</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative group">
                <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <button className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    defaultValue={user.username}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user.email}
                    className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-2">
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* NOTIFICACIONES CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Bell size={20} className="text-green-600" />
              Notificaciones
            </h2>
            <p className="text-sm text-slate-500 mt-1">Gestiona cómo y cuándo quieres recibir notificaciones</p>
          </div>

          <div className="p-6 space-y-5">
            <ToggleOption
              icon={<Mail size={20} />}
              title="Notificaciones por Email"
              description="Recibe el informe PDF automáticamente al completar una auditoría"
              checked={emailNotifs}
              onChange={setEmailNotifs}
            />
            <ToggleOption
              icon={<Zap size={20} />}
              title="Alertas en Tiempo Real"
              description="Notificaciones instantáneas sobre el progreso de tus auditorías"
              checked={autoSave}
              onChange={setAutoSave}
            />
          </div>
        </div>

        {/* SEGURIDAD CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Lock size={20} className="text-purple-600" />
              Seguridad
            </h2>
            <p className="text-sm text-slate-500 mt-1">Protege tu cuenta y datos</p>
          </div>

          <div className="p-6 space-y-4">
            <button className="w-full text-left px-5 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Lock className="text-purple-600" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Cambiar Contraseña</p>
                    <p className="text-sm text-slate-500">Última actualización: hace 3 meses</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors">→</span>
              </div>
            </button>

            <button className="w-full text-left px-5 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Autenticación de Dos Factores</p>
                    <p className="text-sm text-slate-500">Añade una capa extra de seguridad</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">ACTIVO</span>
              </div>
            </button>
          </div>
        </div>

        {/* APARIENCIA CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-6 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Palette size={20} className="text-pink-600" />
              Apariencia
            </h2>
            <p className="text-sm text-slate-500 mt-1">Personaliza cómo se ve Axio</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-3">
              <ThemeOption name="Claro" active />
              <ThemeOption name="Oscuro" />
              <ThemeOption name="Auto" />
            </div>
          </div>
        </div>

        {/* ZONA PELIGRO */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-red-200 overflow-hidden">
          <div className="bg-red-50 p-6 border-b border-red-200">
            <h2 className="font-bold text-red-800 text-lg flex items-center gap-2">
              ⚠️ Zona de Peligro
            </h2>
            <p className="text-sm text-red-600 mt-1">Acciones irreversibles</p>
          </div>

          <div className="p-6">
            <button className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-300 rounded-xl font-semibold transition-all">
              Eliminar Cuenta
            </button>
            <p className="text-xs text-slate-500 mt-2">Esta acción no se puede deshacer</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Componente Toggle Option
function ToggleOption({ icon, title, description, checked, onChange, badge }: any) {
  return (
    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
      <div className="flex gap-4 flex-1">
        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-slate-600 flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-800">{title}</p>
            {badge && (
              <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
      </div>
      
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 ${
          checked ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <div className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all ${
          checked ? 'right-1' : 'left-1'
        }`}></div>
      </button>
    </div>
  );
}

// Componente Theme Option
function ThemeOption({ name, active }: any) {
  return (
    <button className={`p-4 rounded-xl border-2 transition-all ${
      active 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`}>
      <div className={`h-12 w-full rounded-lg mb-3 ${
        name === 'Claro' ? 'bg-white border-2 border-slate-200' :
        name === 'Oscuro' ? 'bg-slate-900' :
        'bg-gradient-to-br from-white to-slate-900'
      }`}></div>
      <p className={`text-sm font-semibold ${active ? 'text-blue-600' : 'text-slate-600'}`}>
        {name}
      </p>
    </button>
  );
}