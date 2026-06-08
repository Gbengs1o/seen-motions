import { ArrowRight } from 'lucide-react';
import Media from './Media';

type WorkItem = {
  title: string;
  year: string;
  mediaUrl: string;
  type?: string;
};

type WorksProps = {
  works: {
    title: string;
    eyebrow: string;
    button: string;
    items: WorkItem[];
  };
};

export default function Works({ works }: WorksProps) {
  return (
    <section id="work" className="works">
      <div className="sectionHead">
        <h2>{works.title}</h2>
        <span>{works.eyebrow}</span>
      </div>

      <div className="workGrid">
        {works.items.map((item, index) => (
          <article
            key={`${item.title}-${index}`}
            className={index === 0 ? 'workLarge' : 'workSmall'}
          >
            <div
              className="mediaWrap"
              style={{
                position: 'relative',
                width: '100%',
                height: index === 0 ? '590px' : '280px',
                overflow: 'hidden',
              }}
            >
              <Media
                url={item.mediaUrl}
                type={item.type}
                alt={item.title}
              />
            </div>

            <div className="caption">
              <span>{item.title}</span>
              <span>{item.year}</span>
            </div>
          </article>
        ))}
      </div>

      <button className="lightButton">
        {works.button}
        <ArrowRight size={20} />
      </button>
    </section>
  );
}