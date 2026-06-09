'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/content';

type HeaderProps = {
  brand: string;
  nav: NavItem[];
  cta: {
    ctaLabel: string;
    ctaHref: string;
  };
};

export default function Header({ brand, nav, cta }: HeaderProps) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (pathname !== '/') {
      setActiveId('');
      return;
    }

    const ids = nav.map((item) => item.sectionId).filter(Boolean) as string[];

    const updateActive = () => {
      const hash = window.location.hash.replace('#', '');

      if (hash && ids.includes(hash)) {
        setActiveId(hash);
        return;
      }

      const viewportMarker = window.innerHeight * 0.38;
      const current = ids.reduce((match, id) => {
        const section = document.getElementById(id);
        if (!section) return match;

        const rect = section.getBoundingClientRect();
        return rect.top <= viewportMarker && rect.bottom > viewportMarker ? id : match;
      }, '');

      setActiveId(current);
    };

    updateActive();
    window.addEventListener('hashchange', updateActive);
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);

    return () => {
      window.removeEventListener('hashchange', updateActive);
      window.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [nav, pathname]);

  return (
    <header className="font-sohne sticky top-0 z-50 grid grid-cols-[1fr_auto] items-center gap-y-5 border-b border-zinc-200 bg-[#f8f8f8] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-black md:grid-cols-[1fr_auto_1fr] md:gap-y-0 md:px-[102px] md:py-0 md:text-[22px]">
      <a className="text-[26px] font-black normal-case tracking-[-0.04em] md:text-[36px]" href="/">
        {brand}
      </a>

      <nav className="order-3 col-span-2 flex items-center justify-between border-t border-zinc-200 pt-4 md:order-none md:col-span-1 md:border-t-0 md:pt-0 md:gap-[42px]">
        {nav.map((item) => {
          const id = item.sectionId || '';
          const isActive = activeId === id;

          return (
            <a
              key={`${item.label}-${item.href}`}
              className={`pb-[9px] leading-none transition-colors hover:text-black md:pb-[11px] ${
                isActive ? 'border-b-[3px] border-[#edc544] text-black' : 'text-zinc-500'
              }`}
              href={item.href}
              onClick={() => setActiveId(id)}
            >
              {item.label}
            </a>
          );
        })}
      </nav>

      <a
        className="premium-button ml-auto inline-flex h-[44px] min-w-[146px] items-center justify-center px-5 text-[10px] font-bold tracking-[0.2em] md:h-[68px] md:min-w-[275px] md:px-7 md:text-[20px]"
        href={cta.ctaHref}
      >
        <span>{cta.ctaLabel}</span>
      </a>
    </header>
  );
}
