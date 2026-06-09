import fs from 'fs/promises';
import path from 'path';

export type LinkItem = { label: string; href: string };
export type NavItem = LinkItem & { sectionId?: string };
export type WorkItem = {
  title: string;
  year: string;
  slug?: string;
  thumbnailUrl: string;
  videoUrl: string;
  description?: string;
  mediaUrl?: string;
  type?: 'image' | 'video';
};
export type PortfolioProject = WorkItem & { discipline: string; buttonLabel: string };
export type SiteContent = {
  brand: string;
  nav: NavItem[];
  header: { ctaLabel: string; ctaHref: string };
  hero: { title: string; subtitle: string; button: string; buttonHref: string; logoUrl: string; backgroundVideoUrl?: string };
  works: { eyebrow: string; title: string; button: string; buttonHref: string; items: WorkItem[] };
  services: { number: string; title: string; body: string }[];
  vision: { title: string; body: string };
  contact: {
    pageTitle: string;
    pageDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    backgroundWord: string;
    formEyebrow: string;
    formTitle: string;
    labels: {
      name: string;
      email: string;
      phone: string;
      whatsapp: string;
      message: string;
    };
    placeholders: {
      name: string;
      email: string;
      phone: string;
      whatsapp: string;
      message: string;
    };
    submitLabel: string;
    helperText: string;
    emailSubject: string;
    directTitle: string;
    email: string;
    phone: string;
    phoneHref: string;
    whatsappLabel: string;
    whatsappHref: string;
    connectTitle: string;
    quickLinks: LinkItem[];
  };
  portfolio: {
    pageTitle: string;
    pageDescription: string;
    title: string;
    countLabel: string;
    featuredButtonLabel: string;
    projectButtonLabel: string;
    projects: PortfolioProject[];
  };
  footer: { copyright: string; links: LinkItem[] };
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
