import { useState, useEffect } from 'react';
import { User, Shield, Mail, Lock, Palette, Save, Key, Check, AlertCircle, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useDropzone } from 'react-dropzone';
import api, { uploadsUrl } from '../services/api';

export default function Settings() {
  const { user, updateUser, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Estados de UI
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Estados Contraseña
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  
  // Estados de Validación y Feedback Visual
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Validación en tiempo real
  const hasMinLength = newPass.length >= 8;
  const hasUpperCase = /[A-Z]/.test(newPass);
  const hasLowerCase = /[a-z]/.test(newPass);
  const hasNumber = /[0-9]/.test(newPass);
  const hasValue = newPass.length > 0;

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;

  // Sincronizo estado local si el usuario cambia externamente
  useEffect(() => {
    if (user?.username) setUsername(user.username);
    if (user?.avatar) setAvatarPreview(uploadsUrl(user.avatar));
  }, [user]);

  // --- DRAG & DROP AVATAR ---
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) {
      alert('Por favor sube una imagen válida');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Subir al servidor
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/auth/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        updateUser(res.data.user);
        alert('✅ Avatar actualizado');
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Error al subir avatar');
      setAvatarPreview(user?.avatar ? uploadsUrl(user.avatar) : null);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'] }
  });

  // --- 1. CAMBIAR TEMA ---
  const handleThemeChange = (mode: 'light' | 'dark') => {
    toggleTheme(mode);
  };

  // --- 2. GUARDAR PERFIL ---
  const handleSaveProfile = async () => {
    if (!username.trim()) return alert("El nombre no puede estar vacío");
    
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { username });
      
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

  // --- 3. CAMBIAR CONTRASEÑA ---
  const handleChangePassword = async () => {
    // Limpiar estados previos
    setPasswordError('');
    setPasswordSuccess(false);

    // Validación preventiva
    if (!currentPass || !newPass) {
      setPasswordError("Por favor completa todos los campos.");
      return;
    }
    
    if (!isPasswordValid) {
      setPasswordError("La contraseña no cumple con todos los requisitos de seguridad.");
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/auth/password', { 
        currentPassword: currentPass, 
        newPassword: newPass 
      });
      
      setPasswordSuccess(true);
      
      // Resetear formulario tras 2 segundos
      setTimeout(() => {
        setShowPasswordForm(false);
        setCurrentPass('');
        setNewPass('');
        setPasswordSuccess(false);
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setPasswordError(error.response?.data?.message || "La contraseña actual no es correcta");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. BORRAR CUENTA ---
  const handleDeleteAccount = async () => {
      if(window.confirm("¿Estás SEGURO? Esta acción es irreversible y borrará todos tus proyectos.")) {
          setLoading(true);
          try {
              await api.delete('/auth/me'); 
              logout(); 
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
              {/* Avatar - Drag & Drop */}
              <div {...getRootProps()} className="relative group cursor-pointer">
                <div className={`h-24 w-24 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg uppercase transition-all ${isDragActive ? 'ring-4 ring-blue-500' : ''} ${avatarPreview ? 'overflow-hidden' : 'bg-gradient-to-br from-blue-500 to-purple-600'}`}>
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.username?.charAt(0) || 'U'
                  )}
                </div>
                <input {...getInputProps()} />
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload size={16} />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Nombre de Usuario</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input 
                        type="email" 
                        value={user?.email || ''}
                        disabled 
                        className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">💡 Arrastra una imagen o haz clic en el avatar para cambiar</p>
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

          <div className="p-6">
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
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Nueva Contraseña</h3>
                    <button onClick={() => setShowPasswordForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
                </div>
                
                {/* Mensajes de Feedback */}
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3 animate-shake">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-3 animate-pulse">
                    <Check className="h-5 w-5" />
                    <span>¡Contraseña actualizada correctamente!</span>
                  </div>
                )}

                <div className="space-y-5">
                  {/* Input 1: Contraseña Actual */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Contraseña Actual</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={currentPass}
                            onChange={(e) => setCurrentPass(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all dark:text-white placeholder:text-slate-300"
                        />
                    </div>
                  </div>

                  {/* Input 2: Nueva Contraseña con Validación Visual */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Nueva Contraseña</label>
                    <div className="relative group">
                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            value={newPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 rounded-xl focus:ring-4 outline-none transition-all dark:text-white placeholder:text-slate-300 ${
                                hasValue && !isPasswordValid
                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                                : 'border-slate-200 dark:border-slate-700 focus:border-purple-500 focus:ring-purple-500/20'
                            }`}
                        />
                    </div>

                    {/* Lista de Requisitos */}
                    <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <p className="text-xs text-slate-400 mb-2 font-medium">Requisitos de seguridad:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <RequirementItem met={hasMinLength} text="Mínimo 8 caracteres" />
                          <RequirementItem met={hasUpperCase} text="Una mayúscula" />
                          <RequirementItem met={hasLowerCase} text="Una minúscula" />
                          <RequirementItem met={hasNumber} text="Un número" />
                        </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button 
                        onClick={handleChangePassword} 
                        disabled={loading || !isPasswordValid || !currentPass} 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                    >
                       {loading ? '...' : 'Confirmar Cambio'}
                    </button>
                    <button 
                        onClick={() => { setShowPasswordForm(false); setPasswordError(''); }} 
                        className="px-5 py-3 text-slate-500 dark:text-slate-400 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
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

        {isAdmin && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-bold text-slate-800 dark:text-white text-lg">Panel de Administracion</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Acceso a la seccion dedicada de admin</p>
            </div>
            <div className="p-6">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all"
              >
                Ir al Panel
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Subcomponente para los items de requisitos
function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-sm transition-all duration-300 ${met ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
      <div className={`h-5 w-5 rounded-full flex items-center justify-center border transition-all ${
        met 
        ? 'bg-green-100 border-green-200 text-green-600 scale-105' 
        : 'bg-slate-100 border-slate-200 text-slate-300'
      }`}>
        {met ? <Check size={12} strokeWidth={3} /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
      </div>
      <span>{text}</span>
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