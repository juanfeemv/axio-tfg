import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { uploadsUrl } from '../services/api';
import { Loader2, SunMoon, Share2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      setLoading(true);
      try {
        const res = await api.get(`/users/${username}`);
        setData(res.data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-slate-900">
      <Loader2 className="animate-spin text-purple-600 h-10 w-10" />
    </div>
  );

  if (!data || !data.user) return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold">Usuario no encontrado</h2>
      <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-slate-200 rounded">Volver</button>
    </div>
  );

  const { user, projects } = data;
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-white dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
              {user.avatar ? (
                <img src={uploadsUrl(user.avatar)} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                user.username?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{user.username}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{projects?.length || 0} proyectos</p>
              <p className="text-xs text-slate-400 mt-2">Miembro desde {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => toggleTheme(theme === 'dark' ? 'light' : 'dark')} className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl transition">
              <SunMoon size={16} />
              <span className="text-sm">{theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}</span>
            </button>
            <button onClick={() => navigator.share ? navigator.share({ title: `Perfil ${user.username}`, url: window.location.href }) : null} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl">
              <Share2 size={14} />
              <span className="text-sm">Compartir</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Proyectos</h2>
        {projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <div key={project._id} onClick={() => navigate(`/project/${project._id}`)} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer">
                {project.image ? (
                  <img src={uploadsUrl(project.image)} alt={project.title} className="w-full h-44 object-cover" />
                ) : (
                  <div className="w-full h-44 flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400">{project.type}</div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">{project.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 truncate">{project.input}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500">Este usuario no ha subido proyectos aún.</div>
        )}
      </div>
    </div>
  );
}
