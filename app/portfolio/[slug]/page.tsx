import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getContent } from '@/lib/content';
import { hasWorkMedia, workSlug, workThumbnail } from '@/lib/work-utils';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

export const dynamic = 'force-dynamic';

type WorkDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function findWork(slug: string) {
  const content = await getContent();
  const works = [...content.portfolio.projects, ...content.works.items].filter(hasWorkMedia);
  const work = works.find((item) => workSlug(item) === slug);

  return { content, work };
}

export async function generateMetadata({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const { content, work } = await findWork(slug);

  if (!work) {
    return {
      title: content.portfolio.pageTitle,
      description: content.portfolio.pageDescription
    };
  }

  return {
    title: `${work.title} | Seen Motions`,
    description: work.description || content.portfolio.pageDescription
  };
}

export default async function WorkDetailPage({ params }: WorkDetailPageProps) {
  const { slug } = await params;
  const { content, work } = await findWork(slug);

  if (!work) {
    notFound();
  }

  const discipline = 'discipline' in work && typeof work.discipline === 'string' ? work.discipline : '';

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      <Header brand={content.brand} cta={content.header} nav={content.nav} />

      <section className="border-b border-zinc-200 px-6 py-10 md:px-16 md:py-14">
        <div className="mx-auto max-w-[1280px]">
          <a
            className="font-sohne mb-8 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 transition hover:text-black"
            href="/portfolio"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to portfolio
          </a>

          <div className="mb-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-sohne text-[10px] font-black uppercase tracking-[0.24em] text-[#d8ad21]">
                {work.year}
              </p>
              <h1 className="font-canela mt-3 text-5xl font-black uppercase leading-none md:text-7xl">
                {work.title}
              </h1>
            </div>
            {discipline ? (
              <p className="font-sohne text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                {discipline}
              </p>
            ) : null}
          </div>

          <div className="relative aspect-video w-full overflow-hidden bg-black">
            <video
              className="h-full w-full object-contain"
              src={work.videoUrl}
              poster={workThumbnail(work)}
              controls
              playsInline
              preload="metadata"
            />
          </div>

          {work.description ? (
            <p className="font-sohne mt-8 max-w-3xl text-base leading-7 text-zinc-700">
              {work.description}
            </p>
          ) : null}
        </div>
      </section>

      <Footer brand={content.brand} footer={content.footer} />
    </main>
  );
}
