'use client';

import { useEffect, useRef } from 'react';

export default function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const count = countRef.current;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (!cursor || !dot || !count || !finePointer) return;

    let frame = 0;
    let counter = 0;
    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };
    const centerDot = { x: pointer.x, y: pointer.y };

    const move = (event: MouseEvent) => {
      const movement = Math.abs(event.movementX) + Math.abs(event.movementY);

      pointer.x = event.clientX;
      pointer.y = event.clientY;
      counter = (counter + Math.max(1, Math.min(9, Math.round(movement / 7)))) % 100;
      count.textContent = counter.toString().padStart(2, '0');
      document.body.classList.remove('cursor-hidden');
    };

    const enterInteractive = (event: Event) => {
      if ((event.target as Element).closest('a, button, input, textarea, select, label')) {
        document.body.classList.add('cursor-active');
      }
    };

    const leaveInteractive = (event: Event) => {
      if ((event.target as Element).closest('a, button, input, textarea, select, label')) {
        document.body.classList.remove('cursor-active');
      }
    };

    const hide = () => document.body.classList.add('cursor-hidden');
    const show = () => document.body.classList.remove('cursor-hidden');

    const render = () => {
      ring.x += (pointer.x - ring.x) * 0.16;
      ring.y += (pointer.y - ring.y) * 0.16;
      centerDot.x += (pointer.x - centerDot.x) * 0.36;
      centerDot.y += (pointer.y - centerDot.y) * 0.36;

      cursor.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${centerDot.x}px, ${centerDot.y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };

    document.body.classList.add('cursor-hidden');
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseleave', hide);
    window.addEventListener('mouseenter', show);
    document.addEventListener('mouseover', enterInteractive);
    document.addEventListener('mouseout', leaveInteractive);
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseleave', hide);
      window.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseover', enterInteractive);
      document.removeEventListener('mouseout', leaveInteractive);
      document.body.classList.remove('cursor-active', 'cursor-hidden');
    };
  }, []);

  return (
    <>
      <div className="premium-cursor" ref={cursorRef}>
        <span ref={countRef}>00</span>
      </div>
      <div className="premium-cursor-dot" ref={dotRef} />
    </>
  );
}
