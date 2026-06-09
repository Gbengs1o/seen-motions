import type { WorkItem } from './content';

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function workSlug(work: Pick<WorkItem, 'slug' | 'title'>) {
  return work.slug?.trim() || slugify(work.title);
}

export function hasWorkMedia(work: WorkItem) {
  return Boolean((work.thumbnailUrl || work.mediaUrl || '').trim() && work.videoUrl.trim());
}

export function workThumbnail(work: WorkItem) {
  return work.thumbnailUrl || work.mediaUrl || '';
}
