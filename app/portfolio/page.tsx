import { getContent } from '@/lib/content';
import { portfolioWorks } from '@/lib/portfolio';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import PortfolioGallery from '@/components/PortfolioGallery';

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
  const projects = portfolioWorks(content);
  const categories = content.portfolio.categories || [];

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      <Header brand={content.brand} cta={content.header} nav={content.nav} />

      <PortfolioGallery
        categories={categories}
        countLabel={content.portfolio.countLabel}
        featuredButtonLabel={content.portfolio.featuredButtonLabel}
        projectButtonLabel={content.portfolio.projectButtonLabel}
        projects={projects}
        title={content.portfolio.title}
      />

      <Footer brand={content.brand} footer={content.footer} />
    </main>
  );
}
