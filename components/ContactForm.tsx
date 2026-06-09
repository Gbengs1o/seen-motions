'use client';

import { FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import type { SiteContent } from '@/lib/content';

type ContactFormProps = {
  contact: SiteContent['contact'];
};

export default function ContactForm({ contact }: ContactFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const whatsapp = String(form.get('whatsapp') || '').trim();
    const message = String(form.get('message') || '').trim();
    const body = [
      `Name: ${name || 'Not provided'}`,
      `Email: ${email || 'Not provided'}`,
      `Call: ${phone || 'Not provided'}`,
      `WhatsApp: ${whatsapp || 'Not provided'}`,
      '',
      'Message:',
      message || 'Not provided'
    ].join('\n');

    const subject = name ? `${contact.emailSubject} from ${name}` : contact.emailSubject;

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-sohne text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            {contact.labels.name}
          </span>
          <input
            className="h-14 border border-zinc-200 bg-[#f7f7f7] px-4 text-base outline-none transition focus:border-black focus:bg-white"
            name="name"
            placeholder={contact.placeholders.name}
            type="text"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-sohne text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            {contact.labels.email}
          </span>
          <input
            className="h-14 border border-zinc-200 bg-[#f7f7f7] px-4 text-base outline-none transition focus:border-black focus:bg-white"
            name="email"
            placeholder={contact.placeholders.email}
            type="email"
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="font-sohne text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            {contact.labels.phone}
          </span>
          <input
            className="h-14 border border-zinc-200 bg-[#f7f7f7] px-4 text-base outline-none transition focus:border-black focus:bg-white"
            name="phone"
            placeholder={contact.placeholders.phone}
            type="tel"
          />
        </label>

        <label className="grid gap-2">
          <span className="font-sohne text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
            {contact.labels.whatsapp}
          </span>
          <input
            className="h-14 border border-zinc-200 bg-[#f7f7f7] px-4 text-base outline-none transition focus:border-black focus:bg-white"
            name="whatsapp"
            placeholder={contact.placeholders.whatsapp}
            type="tel"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="font-sohne text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
          {contact.labels.message}
        </span>
        <textarea
          className="min-h-32 resize-none border border-zinc-200 bg-[#f7f7f7] px-4 py-3 text-base outline-none transition focus:border-black focus:bg-white"
          name="message"
          placeholder={contact.placeholders.message}
        />
      </label>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <button
          className="premium-button premium-button-gold inline-flex h-14 w-full items-center justify-center gap-6 px-8 text-xs font-black uppercase tracking-[0.22em] md:w-fit"
          type="submit"
        >
          <span>{contact.submitLabel}</span>
          <ArrowRight className="h-5 w-5" />
        </button>

        <p className="font-sohne max-w-[360px] text-xs leading-5 text-zinc-500">
          {contact.helperText}
        </p>

        <div className="font-sohne flex flex-wrap gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-zinc-500">
          <a className="transition hover:text-black" href={`mailto:${contact.email}`}>
            {contact.labels.email}
          </a>
          <a className="transition hover:text-black" href={contact.phoneHref}>
            {contact.labels.phone}
          </a>
          <a
            className="transition hover:text-black"
            href={contact.whatsappHref}
            rel="noreferrer"
            target="_blank"
          >
            {contact.labels.whatsapp}
          </a>
        </div>
      </div>
    </form>
  );
}
