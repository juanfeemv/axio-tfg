import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validaciones de contraseña
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validación frontend
    if (!isPasswordValid) {
      setError('La contraseña no cumple con los requisitos de seguridad');
      setIsLoading(false);
      return;
    }
    
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta con otro email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 p-4 relative overflow-hidden transition-colors">
      
      <div className="relative w-full max-w-md">
        
        {/* Sección de logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#3d9171] to-[#23638a] bg-clip-text text-transparent mb-2">
            AXIO
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/50">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Crea tu cuenta</h2>
            <p className="text-slate-500">Empieza a auditar gratis hoy mismo</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs">✕</span>
              </div>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Nombre de Usuario
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-[#23638a]/20 focus:border-[#23638a] outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="JuanDev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-[#23638a]/20 focus:border-[#23638a] outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Contraseña
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-[#23638a]/20 focus:border-[#23638a] outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {/* Requisitos de contraseña */}
              {password && (
                <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Requisitos de seguridad:</p>
                  
                  <div className="space-y-1.5">
                    <div className={`flex items-center gap-2 text-sm transition-colors ${hasMinLength ? 'text-green-600' : 'text-slate-500'}`}>
                      {hasMinLength ? <CheckCircle size={16} className="shrink-0" /> : <XCircle size={16} className="shrink-0" />}
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-sm transition-colors ${hasUpperCase ? 'text-green-600' : 'text-slate-500'}`}>
                      {hasUpperCase ? <CheckCircle size={16} className="shrink-0" /> : <XCircle size={16} className="shrink-0" />}
                      <span>Al menos una mayúscula (A-Z)</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-sm transition-colors ${hasLowerCase ? 'text-green-600' : 'text-slate-500'}`}>
                      {hasLowerCase ? <CheckCircle size={16} className="shrink-0" /> : <XCircle size={16} className="shrink-0" />}
                      <span>Al menos una minúscula (a-z)</span>
                    </div>
                    
                    <div className={`flex items-center gap-2 text-sm transition-colors ${hasNumber ? 'text-green-600' : 'text-slate-500'}`}>
                      {hasNumber ? <CheckCircle size={16} className="shrink-0" /> : <XCircle size={16} className="shrink-0" />}
                      <span>Al menos un número (0-9)</span>
                    </div>
                  </div>
                  
                  {isPasswordValid && (
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                        <CheckCircle size={16} />
                        <span>¡Contraseña segura!</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid}
              className="w-full bg-gradient-to-r from-[#3d9171] to-[#23638a] hover:from-[#338066] hover:to-[#1f577a] disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-[#23638a]/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta Gratis
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-[#23638a] hover:text-[#1d4f72] font-semibold hover:underline">
              Inicia Sesión
            </Link>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Shield size={14} />
            <span>Datos seguros</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle size={14} />
            <span>WCAG Certified</span>
          </div>
        </div>
      </div>
    </div>
  );
}