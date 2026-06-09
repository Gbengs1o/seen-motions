import type { LinkItem } from '@/lib/content';

type FooterProps = {
  brand: string;
  footer: {
    links: LinkItem[];
    copyright: string;
  };
};

export default function Footer({ brand, footer }: FooterProps) {
  return (
    <footer className="font-sohne bg-black px-6 py-12 text-zinc-400 md:px-16 md:py-14">
      <div className="mx-auto grid max-w-[1160px] gap-10 md:grid-cols-[1fr_auto] md:items-start">
        <strong className="text-3xl font-black text-white">{brand}</strong>

        <div className="flex flex-wrap gap-8 text-[10px] tracking-[0.22em]">
          {footer.links.map((link) => (
            <a className="transition-colors hover:text-white" href={link.href} key={`${link.label}-${link.href}`}>
              {link.label}
            </a>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.2em] md:col-span-2">
          {footer.copyright}
        </p>
      </div>
    </footer>
  );
}
