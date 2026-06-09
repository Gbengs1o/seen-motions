import AnimatedNumberText from './AnimatedNumberText';

type Service = {
  number: string;
  title: string;
  body: string;
};

type ServicesProps = {
  services: Service[];
};

export default function Services({ services }: ServicesProps) {
  return (
    <section
      id="services"
      className="border-t border-zinc-300 bg-[#f4f4f4] px-6 py-16 md:px-16 md:py-16"
    >
      <h2 className="font-canela text-center text-2xl font-black uppercase md:text-3xl">SERVICES</h2>

      <div className="mx-auto mt-16 grid max-w-[1100px] gap-10 md:grid-cols-3 md:gap-0">
        {services.map((service) => (
          <article
            className="border-zinc-300 md:border-l md:px-8 first:md:border-l-0"
            key={service.number}
          >
            <AnimatedNumberText
              className="font-sohne text-[10px] font-bold text-[#d8ad21]"
              value={service.number}
            />

            <h3 className="font-canela mt-14 text-[clamp(2rem,3.4vw,3.05rem)] font-black leading-[1.02]">
              {service.title.split('\n').map((line) => (
                <span className="block" key={line}>
                  {line}
                </span>
              ))}
            </h3>

            <p className="font-sohne mt-7 max-w-[270px] text-base leading-6 text-zinc-700">
              {service.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
