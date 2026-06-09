'use client';

import { useEffect } from 'react';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

const stage = (progress: number, start: number, end: number) => {
  return smooth(clamp((progress - start) / (end - start)));
};

export default function HeroScrollAnimation() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('.hero-scroll-section');
    const stageElement = document.querySelector<HTMLElement>('.hero-scroll-stage');
    if (!hero) return;

    let frame = 0;

    const update = () => {
      const start = hero.offsetTop;
      const stageHeight = stageElement?.offsetHeight || window.innerHeight;
      const distance = Math.max(420, hero.offsetHeight - stageHeight);
      const progress = clamp((window.scrollY - start) / distance);
      const logo = stage(progress, 0.02, 0.3);
      const background = stage(progress, 0.16, 0.58);
      const text = stage(progress, 0.34, 0.74);
      const buttonSettle = stage(progress, 0.76, 0.88);
      const buttonExit = stage(progress, 0.88, 1);

      hero.style.setProperty('--hero-bg-scale', `${1 + background * 0.025}`);
      hero.style.setProperty('--hero-bg-y', `${background * -132}px`);
      hero.style.setProperty('--hero-logo-opacity', `${1 - logo}`);
      hero.style.setProperty('--hero-logo-scale', `${1 - logo * 0.08}`);
      hero.style.setProperty('--hero-logo-y', `${logo * -340}px`);
      hero.style.setProperty('--hero-text-opacity', `${1 - text}`);
      hero.style.setProperty('--hero-text-y', `${text * -270}px`);
      hero.style.setProperty('--hero-button-opacity', `${1 - buttonExit}`);
      hero.style.setProperty('--hero-button-y', `${buttonSettle * -10 + buttonExit * -300}px`);
      frame = 0;
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  return null;
}
