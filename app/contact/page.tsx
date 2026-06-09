import { ArrowRight, Mail, MessageCircle, Phone } from 'lucide-react';
import { getContent } from '@/lib/content';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const content = await getContent();

  return {
    title: content.contact.pageTitle,
    description: content.contact.pageDescription
  };
}

export default async function ContactPage() {
  const content = await getContent();
  const contact = content.contact;
  const titleLines = contact.heroTitle.split('\n');

  return (
    <main className="min-h-screen bg-[#f7f7f7] text-black">
      <Header brand={content.brand} cta={content.header} nav={content.nav} />

      <section className="relative overflow-hidden px-6 py-14 md:px-16 md:py-16">
        <div className="pointer-events-none absolute top-64 right-[-12rem] hidden text-[20rem] font-black uppercase leading-none text-black/[0.03] md:block">
          {contact.backgroundWord}
        </div>

        <div className="mx-auto max-w-[1152px]">
          <div className="max-w-[900px]">
            <h1 className="font-canela text-[clamp(4rem,7vw,7.5rem)] font-black uppercase leading-[0.9]">
              {titleLines.map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="font-sohne mt-6 text-lg text-zinc-600">
              {contact.heroSubtitle}
            </p>
          </div>

          <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_368px]">
            <section className="border border-zinc-200 bg-white p-6 md:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="font-sohne text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                    {contact.formEyebrow}
                  </p>
                  <h2 className="font-canela mt-3 text-4xl font-black uppercase md:text-5xl">
                    {contact.formTitle}
                  </h2>
                </div>
              </div>

              <ContactForm contact={contact} />
            </section>

            <aside className="grid gap-0 bg-black p-8 text-white md:p-12">
              <div>
                <p className="font-sohne text-xs font-bold uppercase tracking-[0.22em] text-[#edc544]">
                  {contact.directTitle}
                </p>
                <a className="mt-4 flex items-center gap-3 text-2xl font-bold" href={`mailto:${contact.email}`}>
                  <Mail className="h-5 w-5" />
                  {contact.email}
                </a>
                <a className="mt-4 flex items-center gap-3 text-base text-zinc-300" href={contact.phoneHref}>
                  <Phone className="h-5 w-5" />
                  {contact.phone}
                </a>
                <a
                  className="mt-4 flex items-center gap-3 text-base text-zinc-300"
                  href={contact.whatsappHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle className="h-5 w-5" />
                  {contact.whatsappLabel}
                </a>
              </div>

              <div className="mt-20">
                <p className="font-sohne text-xs font-bold uppercase tracking-[0.22em] text-[#edc544]">
                  {contact.connectTitle}
                </p>
                <div className="mt-6 grid gap-4">
                  {contact.quickLinks.map((link) => (
                    <a
                      className="flex items-center justify-between border-b border-white/15 pb-3 text-base text-zinc-200 transition hover:text-white"
                      href={link.href}
                      key={link.label}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer brand={content.brand} footer={content.footer} />
    </main>
  );
}
