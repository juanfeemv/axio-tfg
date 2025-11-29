import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Sparkles, Shield, CheckCircle } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      setError('Error al registrarse. Intenta con otro email.');
    } finally {
      setIsLoading(false);
    }
  };

  // Validación de fortaleza de contraseña
  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4 relative overflow-hidden">
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-400/10 rounded-full blur-3xl"></div>
      
      <div className="relative w-full max-w-md">
        
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
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
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
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
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
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
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-slate-800 placeholder:text-slate-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    <div className={`h-1.5 flex-1 rounded-full transition-all ${
                      passwordStrength === 'weak' ? 'bg-red-500' : 'bg-slate-200'
                    }`}></div>
                    <div className={`h-1.5 flex-1 rounded-full transition-all ${
                      passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-slate-200'
                    }`}></div>
                    <div className={`h-1.5 flex-1 rounded-full transition-all ${
                      passwordStrength === 'strong' ? 'bg-green-500' : 'bg-slate-200'
                    }`}></div>
                  </div>
                  <p className={`text-xs font-medium ${
                    passwordStrength === 'strong' ? 'text-green-600' :
                    passwordStrength === 'medium' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {passwordStrength === 'strong' ? '✓ Contraseña fuerte' :
                     passwordStrength === 'medium' ? 'Contraseña media' :
                     'Contraseña débil'}
                  </p>
                </div>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-2 focus:ring-purple-500/20 mt-1"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-600 cursor-pointer leading-relaxed">
                Acepto los{' '}
                <a href="#" className="text-purple-600 hover:underline font-medium">
                  términos y condiciones
                </a>
                {' '}y la{' '}
                <a href="#" className="text-purple-600 hover:underline font-medium">
                  política de privacidad
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group"
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

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400 font-medium">O REGÍSTRATE CON</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Social Register */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm font-medium text-slate-700">GitHub</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-slate-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-purple-600 hover:text-purple-800 font-semibold hover:underline">
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