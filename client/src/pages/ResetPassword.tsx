import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      await resetPassword(token!, newPassword);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Token inválido o expirado');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">¡Contraseña actualizada!</h2>
            <p className="text-sm sm:text-base text-slate-600 mb-4">
              Tu contraseña ha sido restablecida correctamente.
            </p>
            <p className="text-xs sm:text-sm text-slate-500">
              Redirigiendo al login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative w-full max-w-md">
        
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AXIO
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50">
          
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Nueva contraseña</h2>
            <p className="text-sm sm:text-base text-slate-500">Establece una contraseña segura</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 sm:p-4 rounded-xl mb-5 sm:mb-6 text-sm flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Nueva contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 text-base"
                  placeholder="Mínimo 8 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Confirmar contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="password"
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-800 placeholder:text-slate-400 text-base"
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Actualizando...
                </>
              ) : (
                'Restablecer contraseña'
              )}
            </button>
          </form>

          <div className="mt-5 sm:mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-blue-600 font-medium min-h-[44px] sm:min-h-0"
            >
              Volver al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}