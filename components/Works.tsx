import { ArrowRight } from 'lucide-react';
import { hasWorkMedia } from '@/lib/work-utils';
import AnimatedNumberText from './AnimatedNumberText';
import WorkPreview from './WorkPreview';

type WorkItem = {
  title: string;
  year: string;
  slug?: string;
  thumbnailUrl: string;
  videoUrl: string;
  description?: string;
  mediaUrl?: string;
};

type WorksProps = {
  works: {
    title: string;
    eyebrow: string;
    button: string;
    buttonHref: string;
    items: WorkItem[];
  };
};

export default function Works({ works }: WorksProps) {
  const uploadedWorks = works.items.filter(hasWorkMedia);

  if (!uploadedWorks.length) {
    return null;
  }

  return (
    <section id="work" className="bg-[#f4f4f4] px-6 py-8 md:px-16 md:py-11">
      <div className="mx-auto flex max-w-[1160px] items-center justify-between">
        <h2 className="font-canela text-2xl font-black uppercase md:text-3xl">{works.title}</h2>
        <AnimatedNumberText
          className="font-sohne text-[10px] font-bold uppercase tracking-[0.24em] text-[#d8ad21]"
          value={works.eyebrow}
        />
      </div>

      <div className="mx-auto mt-12 grid max-w-[1160px] gap-6 md:grid-cols-[2fr_0.95fr]">
        {uploadedWorks.map((item, index) => (
          <WorkPreview
            key={`${item.title}-${index}`}
            featured={index === 0}
            index={index}
            item={item}
          />
        ))}
      </div>

      <a
        className="premium-button premium-button-light mx-auto mt-8 flex h-14 min-w-[230px] items-center justify-center gap-7 px-8 text-[10px] font-black uppercase tracking-[0.18em] md:mt-9 md:w-fit"
        href={works.buttonHref}
      >
        <span>{works.button}</span>
        <ArrowRight size={20} />
      </a>
    </section>
  );
}
