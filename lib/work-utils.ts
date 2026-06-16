import type { CategoryItem, WorkItem } from './content';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function workSlug(work: Pick<WorkItem, 'slug' | 'title'>) {
  return slugify(work.slug || work.title);
}

export function hasWorkMedia(work: WorkItem) {
  return Boolean((work.thumbnailUrl || work.mediaUrl || '').trim() && work.videoUrl.trim());
}

export function workThumbnail(work: WorkItem) {
  return work.thumbnailUrl || work.mediaUrl || '';
}

export function categorySlug(category: Pick<CategoryItem, 'slug' | 'name'>) {
  return slugify(category.slug || category.name);
}

export function categoryHref(category: Pick<CategoryItem, 'slug' | 'name'>) {
  return `/portfolio/category/${categorySlug(category)}`;
}

export function workCategorySlugs(work: WorkItem) {
  return (work.categorySlugs || []).map((slug) => slug.trim()).filter(Boolean);
}

export function workMatchesCategory(work: WorkItem, slug: string) {
  return workCategorySlugs(work).includes(slug);
}

export function categoriesForWork(work: WorkItem, categories: CategoryItem[]) {
  const slugs = new Set(workCategorySlugs(work));
  return categories.filter((category) => slugs.has(categorySlug(category)));
}
