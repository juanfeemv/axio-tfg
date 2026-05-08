import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { uploadsUrl } from '../services/api';
import { Award, BarChart3, Layers, Loader2, MessageCircle, Share2, SunMoon } from 'lucide-react';
import badgeAnalisis from '../assets/badges/ANALISIS.jpg';
import badgeCalidad from '../assets/badges/Calidad +80.jpg';
import badgeComunidad from '../assets/badges/COMUNIDAD.jpg';
import badgeConstante from '../assets/badges/Constante.jpg';
import badgePrimerProyecto from '../assets/badges/Primer Proyecto.jpg';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'projects' | 'stats' | 'badges'>('projects');

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

  const { user, projects, stats, badges } = data;
  const canMessage = !!currentUser && currentUser.username !== user.username;
  const totalProjects = stats?.totalProjects ?? 0;
  const analyzedProjects = stats?.analyzedProjects ?? 0;
  const averageScore = stats?.averageScore ?? 0;
  const totalLikes = stats?.totalLikes ?? 0;
  const analyzedRatio = totalProjects > 0 ? Math.round((analyzedProjects / totalProjects) * 100) : 0;
  const scorePercent = Math.min(100, Math.max(0, averageScore));

  const badgeImages: Record<string, string> = {
    'first-project': badgePrimerProyecto,
    'five-projects': badgeConstante,
    'analyzed-streak': badgeAnalisis,
    'quality-80': badgeCalidad,
    'community-love': badgeComunidad
  };

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
              {user.bio && (
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{user.bio}</p>
              )}
              <p className="text-sm text-slate-500 dark:text-slate-400">{projects?.length || 0} proyectos</p>
              <p className="text-xs text-slate-400 mt-2">Miembro desde {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {canMessage && (
              <button
                onClick={() => navigate('/dashboard', { state: { tab: 'messages', username: user.username } })}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl transition hover:shadow-sm"
              >
                <MessageCircle size={16} />
                <span className="text-sm">Mensaje</span>
              </button>
            )}
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
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setActiveSection('projects')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
              activeSection === 'projects'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="flex items-center gap-2"><Layers size={16} /> Proyectos</span>
          </button>
          <button
            onClick={() => setActiveSection('stats')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
              activeSection === 'stats'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="flex items-center gap-2"><BarChart3 size={16} /> Estadísticas</span>
          </button>
          <button
            onClick={() => setActiveSection('badges')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
              activeSection === 'badges'
                ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <span className="flex items-center gap-2"><Award size={16} /> Insignias</span>
          </button>
        </div>

        {activeSection === 'projects' && (
          <>
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
          </>
        )}

        {activeSection === 'stats' && (
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Proyectos totales</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalProjects}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                  {totalProjects}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Analizados</span>
                  <span>{analyzedProjects}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#23638a] to-[#3d9171]"
                    style={{ width: `${analyzedRatio}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Promedio de calidad</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">{averageScore}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                  {scorePercent}%
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Meta 80</span>
                  <span>{scorePercent >= 80 ? 'OK' : 'En progreso'}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Interacción</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-white">{totalLikes}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
                  ❤
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2">
                  <p className="text-slate-400 text-xs">Likes</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{totalLikes}</p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2">
                  <p className="text-slate-400 text-xs">Analizados</p>
                  <p className="font-semibold text-slate-800 dark:text-white">{analyzedRatio}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'badges' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {badges && badges.length > 0 ? (
              badges.map((badge: any) => (
                <div key={badge.id} className="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex items-center justify-center ring-2 ring-white/70 dark:ring-slate-800">
                      {badgeImages[badge.id] ? (
                        <img src={badgeImages[badge.id]} alt={badge.title} className="h-full w-full object-cover" />
                      ) : (
                        <Award size={20} />
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Logro</span>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-slate-800 dark:text-white text-lg">{badge.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{badge.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500">Aún no hay insignias para este usuario.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
