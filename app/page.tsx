import { getContent } from '@/lib/content';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Works from '@/components/Works';
import Services from '@/components/Services';
import Vision from '@/components/Vision';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const content = await getContent();

  return (
    <main>
      <Header brand={content.brand} cta={content.header} nav={content.nav} />
      <Hero hero={content.hero} />
      <Works works={content.works} />
      <Services services={content.services} />
      <Vision vision={content.vision} />
      <Footer brand={content.brand} footer={content.footer} />
    </main>
  );
}
