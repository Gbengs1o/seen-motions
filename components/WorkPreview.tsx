'use client';

import Link from 'next/link';
import { useRef } from 'react';
import type { WorkItem } from '@/lib/content';
import { workSlug, workThumbnail } from '@/lib/work-utils';
import AnimatedNumberText from './AnimatedNumberText';

type WorkPreviewProps = {
  item: WorkItem;
  index: number;
  featured?: boolean;
  buttonLabel?: string;
  meta?: string;
};

export default function WorkPreview({ item, index, featured, buttonLabel, meta }: WorkPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnail = workThumbnail(item);
  const href = `/portfolio/${workSlug(item)}`;

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => undefined);
  };

  const reset = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <article className={`group ${featured ? 'md:row-span-2' : ''}`}>
      <Link
        aria-label={`View ${item.title}`}
        className="block"
        href={href}
        onMouseEnter={play}
        onMouseLeave={reset}
        onFocus={play}
        onBlur={reset}
      >
        <div className={`relative w-full overflow-hidden bg-zinc-200 ${featured ? 'h-[430px] md:h-[590px]' : 'h-[280px] md:h-[360px]'}`}>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:opacity-0"
            />
          ) : null}
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover grayscale opacity-0 transition duration-700 group-hover:opacity-100"
            src={item.videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            poster={thumbnail}
          />
          {buttonLabel ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition duration-500 group-hover:bg-black/20 group-hover:opacity-100">
              <span className="premium-button inline-flex h-11 min-w-[170px] items-center justify-center px-5 text-[10px] font-bold uppercase tracking-[0.16em]">
                {buttonLabel}
              </span>
            </div>
          ) : null}
        </div>

        <div className="font-canela mt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-[#d8ad21]">
          <span>{item.title}</span>
          <AnimatedNumberText value={item.year} />
        </div>
        {meta ? (
          <p className="font-sohne mt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
            {meta}
          </p>
        ) : null}
      </Link>
    </article>
  );
}
