import fs from 'fs/promises';
import path from 'path';
import { list, put } from '@vercel/blob';

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
const blobContentPath = 'cms/content.json';

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID || process.env.VERCEL);
}

async function getLocalContent(): Promise<SiteContent> {
  const raw = await fs.readFile(contentPath, 'utf8');
  return JSON.parse(raw);
}

async function getBlobContent(): Promise<SiteContent | null> {
  if (!hasBlobStorage()) {
    return null;
  }

  try {
    const { blobs } = await list({
      prefix: blobContentPath,
      limit: 1
    });
    const blob = blobs.find((item) => item.pathname === blobContentPath) || blobs[0];

    if (!blob?.url) {
      return null;
    }

    const response = await fetch(`${blob.url}?ts=${Date.now()}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

export async function getContent(): Promise<SiteContent> {
  const blobContent = await getBlobContent();
  return blobContent || getLocalContent();
}

export async function saveContent(content: SiteContent) {
  if (hasBlobStorage()) {
    await put(blobContentPath, JSON.stringify(content, null, 2), {
      access: 'public',
      allowOverwrite: true,
      cacheControlMaxAge: 0,
      contentType: 'application/json'
    });
    return;
  }

  await fs.mkdir(path.dirname(contentPath), { recursive: true });
  await fs.writeFile(contentPath, JSON.stringify(content, null, 2));
}
