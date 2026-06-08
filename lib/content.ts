import fs from 'fs/promises';
import path from 'path';

export type WorkItem = { title: string; year: string; mediaUrl: string; type: 'image' | 'video' };
export type SiteContent = {
  brand: string;
  nav: string[];
  hero: { title: string; subtitle: string; button: string; logoUrl: string; backgroundVideoUrl?: string };
  works: { eyebrow: string; title: string; button: string; items: WorkItem[] };
  services: { number: string; title: string; body: string }[];
  vision: { title: string; body: string };
  footer: { copyright: string; links: string[] };
};

const contentPath = path.join(process.cwd(), 'data', 'content.json');

export async function getContent(): Promise<SiteContent> {
  const raw = await fs.readFile(contentPath, 'utf8');
  return JSON.parse(raw);
}

export async function saveContent(content: SiteContent) {
  await fs.mkdir(path.dirname(contentPath), { recursive: true });
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
}
