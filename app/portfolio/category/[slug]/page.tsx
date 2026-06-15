import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getContent } from '@/lib/content';
import { categorySlug, workMatchesCategory } from '@/lib/work-utils';
import { portfolioWorks, workButtonLabel, workDiscipline } from '@/lib/portfolio';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import WorkPreview from '@/components/WorkPreview';

export const dynamic = 'force-dynamic';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

async function categoryData(slug: string) {
  const content = await getContent();
  const categories = content.portfolio.categories || [];
  const category = categories.find((item) => categorySlug(item) === slug);
  const works = portfolioWorks(content).filter((work) => workMatchesCategory(work, slug));

  return { content, category, works };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { content, category } = await categoryData(slug);

  if (!category) {
    return {
      title: content.portfolio.pageTitle,
      description: content.portfolio.pageDescription
    };
  }

  return {
    title: `${category.name} Videos | Seen Motions`,
    description: category.description || content.portfolio.pageDescription
  };
}

export default async function PortfolioCategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { content, category, works } = await categoryData(slug);

  if (!category) {
    notFound();
  }

  const [featured, ...secondaryWorks] = works;

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
            All portfolio
          </a>

          <div className="mb-10 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="font-sohne text-[10px] font-black uppercase tracking-[0.24em] text-[#d8ad21]">
                Category
              </p>
              <h1 className="font-canela mt-3 text-5xl font-black uppercase leading-none md:text-7xl">
                {category.name}
              </h1>
              {category.description ? (
                <p className="font-sohne mt-5 max-w-2xl text-sm leading-6 text-zinc-600">
                  {category.description}
                </p>
              ) : null}
            </div>
            <span className="font-sohne text-[10px] font-black uppercase tracking-[0.24em] text-[#d8ad21]">
              {works.length.toString().padStart(2, '0')} Videos
            </span>
          </div>

          {featured ? (
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
              <WorkPreview
                buttonLabel={workButtonLabel(featured, content.portfolio.featuredButtonLabel)}
                featured
                index={0}
                item={featured}
                meta={workDiscipline(featured)}
              />
              <div className="grid gap-8">
                {secondaryWorks.map((work, index) => (
                  <WorkPreview
                    buttonLabel={workButtonLabel(work, content.portfolio.projectButtonLabel)}
                    index={index + 1}
                    item={work}
                    key={`${work.title}-${index}`}
                    meta={`${(index + 2).toString().padStart(2, '0')}${workDiscipline(work) ? ` / ${workDiscipline(work)}` : ''}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <p className="font-sohne border border-zinc-300 bg-white p-8 text-sm uppercase tracking-[0.12em] text-zinc-500">
              No videos have been assigned to this category yet.
            </p>
          )}
        </div>
      </section>

      <Footer brand={content.brand} footer={content.footer} />
    </main>
  );
}
