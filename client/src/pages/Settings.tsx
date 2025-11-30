import { useState, useEffect } from 'react';
import { User, Shield, Bell, Mail, Lock, Palette, Zap, Save, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // <--- Usamos el estado global del tema
import api from '../services/api';

export default function Settings() {
  const { user, updateUser, logout } = useAuth(); // Añadimos logout para la Zona de Peligro
  const { theme, toggleTheme } = useTheme(); // <--- Usamos el estado global del tema

  // Estados de UI inicializados con datos reales
  const [username, setUsername] = useState(user?.username || '');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [realTimeAlerts, setRealTimeAlerts] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Estados Contraseña
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  // Sincronizar estado local si el usuario cambia externamente
  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);

  // --- 1. CAMBIAR TEMA (Visual) ---
  const handleThemeChange = (mode: 'light' | 'dark') => {
    toggleTheme(mode);
  };

  // --- 2. GUARDAR PERFIL (Backend) ---
  const handleSaveProfile = async () => {
    if (!username.trim()) return alert("El nombre no puede estar vacío");
    
    setLoading(true);
    try {
      // Llamamos al Backend
      const res = await api.put('/auth/profile', { username });
      
      // Si sale bien, actualizamos el contexto localmente
      if (res.data.success) {
         updateUser(res.data.user);
         alert("✅ Perfil actualizado correctamente");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. CAMBIAR CONTRASEÑA (Backend) ---
  const handleChangePassword = async () => {
    if (!currentPass || !newPass) return alert("Rellena ambas contraseñas");
    if (newPass.length < 6) return alert("La nueva contraseña debe tener al menos 6 caracteres");
    
    setLoading(true);
    try {
      await api.put('/auth/password', { 
        currentPassword: currentPass, 
        newPassword: newPass 
      });
      
      alert("✅ Contraseña cambiada con éxito");
      setShowPasswordForm(false);
      setCurrentPass('');
      setNewPass('');
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. BORRAR CUENTA (Funcional) ---
  const handleDeleteAccount = async () => {
      if(window.confirm("¿Estás SEGURO? Esta acción es irreversible y borrará todos tus proyectos.")) {
          setLoading(true);
          try {
              // Llamamos a la ruta DELETE del backend
              await api.delete('/auth/me'); 
              logout(); // Cerramos la sesión local
              alert("✅ Cuenta eliminada con éxito. Redirigiendo...");
          } catch (error) {
              console.error("Error eliminando cuenta:", error);
              alert("Error al intentar eliminar la cuenta.");
          } finally {
              setLoading(false);
          }
      }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
          <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Shield className="text-purple-600 dark:text-purple-400" size={24} />
          </div>
          Configuración
        </h1>
        <p className="text-slate-500 dark:text-slate-400">Personaliza tu experiencia en Axio</p>
      </div>

      <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        
        {/* PERFIL CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <User size={20} className="text-blue-600 dark:text-blue-400" />
              Perfil Público
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Esta información será visible para otros usuarios</p>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Avatar */}
              <div className="relative group cursor-pointer">
                <div className="h-24 w-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg uppercase">
                  {user?.username?.charAt(0) || 'U'}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ''}
                    disabled 
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <button 
                onClick={handleSaveProfile}
                disabled={loading}
                className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        {/* SEGURIDAD CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <Lock size={20} className="text-purple-600 dark:text-purple-400" />
              Seguridad
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Protege tu cuenta y datos</p>
          </div>

          <div className="p-6 space-y-4">
            {!showPasswordForm ? (
              <button onClick={() => setShowPasswordForm(true)} className="w-full text-left px-5 py-4 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex justify-between items-center group">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <Lock className="text-purple-600 dark:text-purple-400" size={18} />
                   </div>
                   <div>
                      <p className="font-semibold text-slate-800 dark:text-white">Cambiar Contraseña</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">******</p>
                   </div>
                </div>
                <span className="text-slate-400 group-hover:text-slate-600 transition-colors">→</span>
              </button>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-200">
                <h3 className="font-bold text-slate-700 dark:text-white mb-4">Nueva Contraseña</h3>
                <div className="space-y-3">
                  <input 
                    type="password" 
                    placeholder="Contraseña Actual"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input 
                    type="password" 
                    placeholder="Nueva Contraseña (min 6 chars)"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full px-4 py-2 border dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleChangePassword} disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 disabled:opacity-50">
                       {loading ? '...' : 'Confirmar Cambio'}
                    </button>
                    <button onClick={() => setShowPasswordForm(false)} className="text-slate-500 dark:text-slate-400 px-4 py-2 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-700">Cancelar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NOTIFICACIONES CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <Bell size={20} className="text-green-600 dark:text-green-400" />
              Notificaciones
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestiona cómo y cuándo quieres recibir notificaciones</p>
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
              checked={realTimeAlerts}
              onChange={setRealTimeAlerts}
            />
          </div>
        </div>

        {/* APARIENCIA CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-slate-700 dark:to-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="font-bold text-slate-800 dark:text-white text-lg flex items-center gap-2">
              <Palette size={20} className="text-pink-600 dark:text-pink-400" />
              Apariencia
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              <ThemeOption name="Claro" active={theme === 'light'} onClick={() => handleThemeChange('light')} />
              <ThemeOption name="Oscuro" active={theme === 'dark'} onClick={() => handleThemeChange('dark')} />
            </div>
          </div>
        </div>

        {/* ZONA PELIGRO */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-red-200 dark:border-red-900 overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 border-b border-red-200 dark:border-red-900">
            <h2 className="font-bold text-red-800 dark:text-red-400 text-lg flex items-center gap-2">
              ⚠️ Zona de Peligro
            </h2>
          </div>
          <div className="p-6">
            <button onClick={handleDeleteAccount} className="px-5 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border-2 border-red-300 dark:border-red-800 rounded-xl font-semibold transition-all">
              Eliminar Cuenta
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Esta acción no se puede deshacer</p>
          </div>
        </div>

      </div>
    </div>
  );
}

function ToggleOption({ icon, title, description, checked, onChange }: any) {
  return (
    <div className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
      <div className="flex gap-4 flex-1">
        <div className="h-10 w-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 flex-shrink-0 shadow-sm border border-slate-100 dark:border-slate-700">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-800 dark:text-white">{title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <button onClick={() => onChange(!checked)} className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 mt-1 ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-7' : 'translate-x-1'}`}></div>
      </button>
    </div>
  );
}

function ThemeOption({ name, active, onClick }: any) {
  return (
    <button onClick={onClick} className={`p-4 rounded-xl border-2 transition-all duration-200 group ${active ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/30 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'}`}>
      <div className={`h-12 w-full rounded-lg mb-3 transition-colors ${name === 'Claro' ? 'bg-white border border-slate-200' : 'bg-slate-900 border border-slate-700'}`}></div>
      <p className={`text-sm font-semibold transition-colors ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>{name}</p>
    </button>
  );
}