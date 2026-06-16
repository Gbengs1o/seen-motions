'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { CategoryItem, PortfolioProject, WorkItem } from '@/lib/content';
import { categoryHref, categorySlug, workCategorySlugs, workSlug, workThumbnail } from '@/lib/work-utils';
import AnimatedNumberText from './AnimatedNumberText';

type GalleryWork = WorkItem | PortfolioProject;

type PortfolioGalleryProps = {
  categories: CategoryItem[];
  countLabel: string;
  featuredButtonLabel: string;
  projectButtonLabel: string;
  projects: GalleryWork[];
  title: string;
};

export default function PortfolioGallery({
  categories,
  countLabel,
  featuredButtonLabel,
  projectButtonLabel,
  projects,
  title
}: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const titleLines = title.split('\n');
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return projects;
    }

    return projects.filter((project) => workCategorySlugs(project).includes(activeCategory));
  }, [activeCategory, projects]);
  const activeCategoryData = categories.find((category) => categorySlug(category) === activeCategory);

  return (
    <section className="portfolioGalleryShell">
      <div className="portfolioGalleryHeader">
        <div>
          <p className="portfolioGalleryKicker">Motion archive</p>
          <h1>
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
        </div>

        <div className="portfolioGalleryMeta">
          <AnimatedNumberText value={countLabel} />
          <p>
            Hover a piece to open the frame. Click to watch the full project.
          </p>
        </div>
      </div>

      {categories.length ? (
        <div className="portfolioFilterBar" aria-label="Portfolio filters">
          <button
            aria-pressed={activeCategory === 'all'}
            className={activeCategory === 'all' ? 'isActive' : ''}
            onClick={() => setActiveCategory('all')}
            type="button"
          >
            All
          </button>
          {categories.map((category) => {
            const slug = categorySlug(category);
            return (
              <button
                aria-pressed={activeCategory === slug}
                className={activeCategory === slug ? 'isActive' : ''}
                key={slug}
                onClick={() => setActiveCategory(slug)}
                type="button"
              >
                {category.name}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="portfolioGalleryStatus">
        <span>{filteredProjects.length.toString().padStart(2, '0')} showing</span>
        {activeCategoryData ? (
          <Link href={categoryHref(activeCategoryData)}>
            Share {activeCategoryData.name}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span>All categories</span>
        )}
      </div>

      {filteredProjects.length ? (
        <div className="portfolioGalleryTrack" key={activeCategory}>
          {filteredProjects.map((project, index) => (
            <GalleryCard
              buttonLabel={index === 0 ? featuredButtonLabel : projectButtonLabel}
              index={index}
              key={workSlug(project)}
              project={project}
            />
          ))}
        </div>
      ) : (
        <div className="portfolioEmptyState">
          No videos are assigned to this category yet.
        </div>
      )}
    </section>
  );
}

function GalleryCard({
  buttonLabel,
  index,
  project
}: {
  buttonLabel: string;
  index: number;
  project: GalleryWork;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const thumbnail = workThumbnail(project);
  const discipline = 'discipline' in project && typeof project.discipline === 'string' ? project.discipline : '';

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
    <article className="portfolioGalleryCard">
      <Link
        aria-label={`View ${project.title}`}
        href={`/portfolio/${workSlug(project)}`}
        onBlur={reset}
        onFocus={play}
        onMouseEnter={play}
        onMouseLeave={reset}
      >
        <div className="portfolioMediaFrame">
          {thumbnail ? (
            <img alt={project.title} src={thumbnail} />
          ) : null}
          <video
            ref={videoRef}
            loop
            muted
            playsInline
            poster={thumbnail}
            preload="metadata"
            src={project.videoUrl}
          />
          <div className="portfolioCardShade" />
          <span className="portfolioCardIndex">
            {(index + 1).toString().padStart(2, '0')}
          </span>
          <span className="portfolioCardButton">
            {buttonLabel}
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        <div className="portfolioCardText">
          <div>
            <h2>{project.title}</h2>
            {discipline ? <p>{discipline}</p> : null}
          </div>
          <AnimatedNumberText value={project.year} />
        </div>
      </Link>
    </article>
  );
}
