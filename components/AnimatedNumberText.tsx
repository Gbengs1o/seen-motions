'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type AnimatedNumberTextProps = {
  value: string;
  className?: string;
  delay?: number;
  duration?: number;
  startOnView?: boolean;
};

export default function AnimatedNumberText({
  value,
  className,
  delay = 80,
  duration = 1050,
  startOnView = true
}: AnimatedNumberTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const targets = useMemo(() => value.match(/\d+/g) || [], [value]);
  const [display, setDisplay] = useState(value);
  const [shouldRun, setShouldRun] = useState(!startOnView);

  useEffect(() => {
    const element = ref.current;

    if (!startOnView || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRun(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.35 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!shouldRun || !targets.length) return;

    let frame = 0;
    let timeout = 0;
    const starts = targets.map((target, index) => {
      const targetNumber = Number(target);
      const shortNumberBase = 10 ** target.length;

      if (target.length <= 2) {
        return (targetNumber + 67 + index * 11) % shortNumberBase;
      }

      const sweep = 90 + index * 17;
      return Math.max(0, targetNumber - sweep);
    });

    const tick = (startedAt: number) => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      let tokenIndex = 0;

      setDisplay(
        value.replace(/\d+/g, (token) => {
          const targetNumber = Number(token);
          const next = Math.round(starts[tokenIndex] + (targetNumber - starts[tokenIndex]) * eased);
          tokenIndex += 1;
          return next.toString().padStart(token.length, '0');
        })
      );

      if (progress < 1) {
        frame = requestAnimationFrame(() => tick(startedAt));
      } else {
        setDisplay(value);
      }
    };

    timeout = window.setTimeout(() => {
      frame = requestAnimationFrame(() => tick(performance.now()));
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [delay, duration, shouldRun, targets, value]);

  return (
    <span className={className} ref={ref}>
      {display}
    </span>
  );
}
