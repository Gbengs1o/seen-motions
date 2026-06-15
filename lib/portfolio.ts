import type { PortfolioProject, SiteContent, WorkItem } from './content';
import { hasWorkMedia, workSlug } from './work-utils';

export type DisplayWork = WorkItem | PortfolioProject;

export function portfolioWorks(content: SiteContent): DisplayWork[] {
  const seen = new Set<string>();
  const works = [...content.portfolio.projects, ...content.works.items].filter(hasWorkMedia);

  return works.filter((work) => {
    const slug = workSlug(work);
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  });
}

export function workDiscipline(work: DisplayWork) {
  return 'discipline' in work && typeof work.discipline === 'string' ? work.discipline : '';
}

export function workButtonLabel(work: DisplayWork, fallback: string) {
  return 'buttonLabel' in work && work.buttonLabel ? work.buttonLabel : fallback;
}
