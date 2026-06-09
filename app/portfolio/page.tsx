import { getContent } from '@/lib/content';
import { hasWorkMedia } from '@/lib/work-utils';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import WorkPreview from '@/components/WorkPreview';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const content = await getContent();

  return {
    title: content.portfolio.pageTitle,
    description: content.portfolio.pageDescription
  };
}

export default async function PortfolioPage() {
  const content = await getContent();
  const projects = content.portfolio.projects.filter(hasWorkMedia);
  const [featured, ...secondaryProjects] = projects;
  const titleLines = content.portfolio.title.split('\n');

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      <Header brand={content.brand} cta={content.header} nav={content.nav} />

      <section className="grid min-h-[calc(100vh-70px)] border-b border-zinc-200 lg:grid-cols-[minmax(0,2fr)_minmax(360px,1fr)]">
        <section className="border-zinc-200 px-6 py-10 md:px-16 md:py-16 lg:border-r">
          {featured ? (
            <WorkPreview
              buttonLabel={featured.buttonLabel || content.portfolio.featuredButtonLabel}
              featured
              index={0}
              item={featured}
              meta={featured.discipline}
            />
          ) : null}
        </section>

        <aside className="border-zinc-200 px-6 py-10 md:px-12 md:py-16">
          <div className="lg:sticky lg:top-[104px]">
            <div className="mb-10 flex items-end justify-between gap-6">
              <h1 className="font-canela text-4xl font-black uppercase leading-none md:text-6xl">
                {titleLines.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </h1>
              <span className="font-sohne text-[10px] font-bold uppercase tracking-[0.24em] text-[#d8ad21]">
                {content.portfolio.countLabel}
              </span>
            </div>

            {secondaryProjects.length ? <div className="grid gap-8">
              {secondaryProjects.map((project, index) => (
                <WorkPreview
                  buttonLabel={project.buttonLabel || content.portfolio.projectButtonLabel}
                  index={index + 1}
                  item={project}
                  key={project.title}
                  meta={`${(index + 2).toString().padStart(2, '0')} / ${project.discipline}`}
                />
              ))}
            </div> : null}
          </div>
        </aside>
      </section>

      <Footer brand={content.brand} footer={content.footer} />
    </main>
  );
}
