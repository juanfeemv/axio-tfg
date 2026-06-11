import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { uploadsUrl } from '../services/api';
import {
	FolderOpen,
	Calendar,
	ArrowRight,
	TrendingUp,
	Link2,
	FileText,
	FileCode,
	BarChart3,
	Filter,
	Loader2,
	AlertCircle,
	Trash2,
} from 'lucide-react';

export default function MyProjects() {
	const [projects, setProjects] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const navigate = useNavigate();
	const [filter, setFilter] = useState<'all' | 'url' | 'file' | 'code'>('all');

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const res = await api.get('/projects');
				setProjects(res.data.data);
			} catch (err) {
				console.error('Error cargando proyectos:', err);
				setError('No se pudieron cargar tus proyectos.');
			} finally {
				setLoading(false);
			}
		};
		fetchProjects();
	}, []);

	const handleDelete = async (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (!window.confirm('¿Estás seguro de eliminar este proyecto?')) return;
		try {
			await api.delete(`/projects/${id}`);
			setProjects((prev) => prev.filter((p) => p._id !== id));
		} catch {
			alert('No se pudo eliminar el proyecto.');
		}
	};

	const handleViewReport = (id: string) => navigate(`/project/${id}`);

	const filteredProjects = projects.filter((project) =>
		filter === 'all' ? true : project.type === filter
	);

	const totalProjects = projects.length;
	const analyzedProjects = projects.filter((p) => p.status === 'analyzed');
	const avgScore =
		analyzedProjects.length > 0
			? Math.round(
				analyzedProjects.reduce((acc, p) => acc + (p.accessibilityScore || 0), 0) /
				analyzedProjects.length
			)
			: 0;
	const estimatedIssues = analyzedProjects.reduce(
		(acc, p) => acc + (p.issuesCount || 0),
		0
	);

	if (loading)
		return (
			<div className="flex h-full items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
				<div className="text-center">
					<Loader2 className="animate-spin text-blue-600 h-10 w-10 mx-auto mb-4" />
					<p className="text-slate-500 dark:text-slate-400">Cargando tu portafolio...</p>
				</div>
			</div>
		);

	if (error)
		return (
			<div className="flex h-full items-center justify-center p-8 text-red-500 dark:text-red-400 gap-2">
				<AlertCircle /> {error}
			</div>
		);

	return (
		<div className="p-8 max-w-7xl mx-auto min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">

			{/* Header */}
			<div className="mb-10 animate-fade-in-up">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
							<div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
								<FolderOpen className="text-blue-600 dark:text-blue-400" size={24} />
							</div>
							Mis Proyectos
						</h1>
						<p className="text-slate-500 dark:text-slate-400">Gestiona y revisa tus auditorías</p>
					</div>
				</div>

				{/* Stats */}
				<div className="grid md:grid-cols-3 gap-4 mb-8">
					<div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-800 p-6 rounded-2xl border border-blue-200 dark:border-slate-700">
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Total</span>
							<BarChart3 className="text-blue-600 dark:text-blue-400" size={24} />
						</div>
						<div className="text-3xl font-bold text-blue-900 dark:text-white">{totalProjects}</div>
						<div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Auditorías realizadas</div>
					</div>

					<div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-700 dark:to-slate-800 p-6 rounded-2xl border border-green-200 dark:border-slate-700">
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Calidad Media</span>
							<TrendingUp className="text-emerald-600 dark:text-emerald-400" size={24} />
						</div>
						<div className="text-3xl font-bold text-emerald-900 dark:text-white">{avgScore}/100</div>
						<div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Puntuación global</div>
					</div>

					<div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-slate-700 dark:to-slate-800 p-6 rounded-2xl border border-orange-200 dark:border-slate-700">
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm font-semibold text-orange-800 dark:text-orange-300">Issues Estimados</span>
							<Filter className="text-orange-600 dark:text-orange-400" size={24} />
						</div>
						<div className="text-3xl font-bold text-orange-900 dark:text-white">{estimatedIssues}</div>
						<div className="text-xs text-orange-700 dark:text-orange-300 mt-1">Problemas detectados</div>
					</div>
				</div>
			</div>

			{/* Filtros */}
			<div className="flex flex-wrap gap-3 mb-6">
				{(['all', 'url', 'file', 'code'] as const).map((f) => (
					<button
						key={f}
						onClick={() => setFilter(f)}
						className={`px-4 py-2 rounded-xl font-medium text-sm transition-all border ${filter === f
								? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-blue-600'
								: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
							}`}
					>
						{f === 'all' ? 'Todos' : f === 'file' ? 'Diseños' : f === 'url' ? 'Webs' : 'Código'}
					</button>
				))}
			</div>

			{/* Grid de Proyectos */}
			{filteredProjects.length === 0 ? (
				<div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl bg-slate-50/50 dark:bg-slate-800/50 gap-3">
					<FolderOpen className="text-slate-400 dark:text-slate-600" size={52} />
					<h3 className="text-2xl font-bold text-slate-700 dark:text-white">Sin proyectos aún</h3>
					<p className="text-slate-500 dark:text-slate-400 max-w-md">
						{filter === 'all'
							? 'Crea tu primera auditoría para ver el resumen aquí.'
							: `No hay proyectos de tipo "${filter}". Sube uno para empezar.`}
					</p>
					<button
						onClick={() => navigate('/dashboard', { state: { tab: 'new' } })}
						className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:-translate-y-0.5 transition"
					>
						Crear primer proyecto
					</button>
				</div>
			) : (
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
 					{filteredProjects.map((project) => {
 						const isAnalyzed = project.status === 'analyzed';
 						const score = project.accessibilityScore || 0;
 						const issuesCount = project.issuesCount || 0;

						// Solo usar project.image como preview; project.input para url/code no es una imagen
						const imageUrl = project.image ? uploadsUrl(project.image) : null;
						const isPdf = project.image?.toLowerCase().endsWith('.pdf');

						let TypeIcon = Link2;
						let typeStyle = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
						let typeLabel = 'URL';

						if (project.type === 'file') {
							TypeIcon = FileText;
							typeStyle = 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
							typeLabel = 'DISEÑO';
						} else if (project.type === 'code') {
							TypeIcon = FileCode;
							typeStyle = 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
							typeLabel = 'CÓDIGO';
						}

						const scoreColor =
							score >= 80
								? 'text-green-600 dark:text-green-400'
								: score >= 50
									? 'text-yellow-600 dark:text-yellow-400'
									: 'text-red-600 dark:text-red-400';

						const barColor =
							!isAnalyzed
								? 'bg-slate-200 dark:bg-slate-700'
								: score >= 80
									? 'bg-gradient-to-r from-green-500 to-emerald-500'
									: score >= 50
										? 'bg-gradient-to-r from-yellow-500 to-orange-500'
										: 'bg-gradient-to-r from-red-500 to-pink-500';

						return (
							<div
								key={project._id}
								onClick={() => handleViewReport(project._id)}
								className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col"
							>
								{/* Imagen o placeholder */}
								<div className="relative h-40 bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
									{imageUrl && !isPdf ? (
										<img
											src={imageUrl}
											alt={project.title}
											className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
									) : (
										<div className="h-full w-full flex flex-col items-center justify-center gap-2">
											<div className={`p-4 rounded-2xl ${typeStyle}`}>
												<TypeIcon size={32} />
											</div>
											<p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
												{typeLabel}
											</p>
										</div>
									)}

									{/* Botón borrar flotante */}
									<button
										onClick={(e) => handleDelete(project._id, e)}
										className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-700/90 hover:bg-red-50 dark:hover:bg-red-900/50 text-slate-400 hover:text-red-500 rounded-full transition-colors z-10 shadow-sm border border-slate-100 dark:border-slate-600 opacity-0 group-hover:opacity-100"
										title="Eliminar proyecto"
									>
										<Trash2 size={16} />
									</button>
								</div>

								{/* Barra de color según score */}
								<div className={`h-1.5 shrink-0 ${barColor}`} />

								{/* Contenido — todo dentro del mismo contenedor con padding */}
								<div className="p-5 flex flex-col gap-3 flex-1">

									{/* Fila: badge de tipo + score (score solo si analizado) */}
									<div className="flex items-center justify-between">
										<span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 ${typeStyle}`}>
											<TypeIcon size={12} />
											{typeLabel}
										</span>
										{isAnalyzed && (
											<div className="text-right">
												<div className={`text-xl font-bold leading-none ${scoreColor}`}>{score}</div>
												<span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
													Score
												</span>
											</div>
										)}
									</div>

									{/* Título */}
									<h3
										className="font-bold text-slate-800 dark:text-white text-base leading-snug truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
										title={project.title}
									>
										{project.title}
									</h3>

									{/* URL / Nombre de archivo */}
									<p className="text-xs text-slate-500 dark:text-slate-400 truncate font-mono bg-slate-50 dark:bg-slate-900 px-2 py-1.5 rounded border border-slate-100 dark:border-slate-700">
										{project.input}
									</p>

									{/* Barra de issues o estado pendiente */}
									{isAnalyzed ? (
										<div className="flex items-center gap-2">
											<div className="h-1.5 flex-1 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
												<div
													className={`h-full rounded-full ${issuesCount > 10 ? 'bg-red-500' : issuesCount > 5 ? 'bg-yellow-500' : 'bg-green-500'
														}`}
													style={{ width: `${Math.min((issuesCount / 20) * 100, 100)}%` }}
												/>
											</div>
											<span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">
												~{issuesCount} issues
											</span>
										</div>
									) : (
										<span className="text-xs text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 self-start">
											Pendiente de auditoría
										</span>
									)}

									{/* Spacer empuja fecha y botón al fondo */}
									<div className="flex-1" />

									{/* Fecha */}
									<div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
										<Calendar size={12} />
										<span>{new Date(project.createdAt).toLocaleDateString()}</span>
									</div>

									{/* Botón ver reporte */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											handleViewReport(project._id);
										}}
										className="w-full py-2 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
									>
										Ver Reporte <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
									</button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}