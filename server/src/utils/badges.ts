export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
}

export interface ProfileStats {
  totalProjects: number;
  analyzedProjects: number;
  averageScore: number;
  totalLikes: number;
}

export const getBadgesForStats = (stats: ProfileStats): BadgeDefinition[] => {
  const badges: BadgeDefinition[] = [];

  if (stats.totalProjects >= 1) {
    badges.push({
      id: 'first-project',
      title: 'Primer proyecto',
      description: 'Publico su primera auditoria'
    });
  }

  if (stats.totalProjects >= 5) {
    badges.push({
      id: 'five-projects',
      title: 'Constante',
      description: 'Cinco proyectos publicados'
    });
  }

  if (stats.analyzedProjects >= 3) {
    badges.push({
      id: 'analyzed-streak',
      title: 'Analisis activo',
      description: 'Tres proyectos analizados con IA'
    });
  }

  if (stats.averageScore >= 80) {
    badges.push({
      id: 'quality-80',
      title: 'Calidad 80+',
      description: 'Promedio de calidad superior a 80'
    });
  }

  if (stats.totalLikes >= 10) {
    badges.push({
      id: 'community-love',
      title: 'Comunidad',
      description: 'Diez likes recibidos en total'
    });
  }

  return badges;
};
