type VisionProps = {
  vision: {
    title: string;
    body: string;
  };
};

export default function Vision({ vision }: VisionProps) {
  return (
    <section
      id="studio"
      className="overflow-hidden border-t border-zinc-300 bg-[#f4f4f4] px-6 py-20 md:px-16 md:py-28"
    >
      <div className="mx-auto grid max-w-[1160px] items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(340px,1fr)] md:gap-16">
        <h2 className="font-canela max-w-full break-words text-[clamp(3.25rem,7vw,7.5rem)] font-black uppercase leading-none">
          {vision.title}
        </h2>
        <p className="font-sohne max-w-[680px] text-base leading-7 text-black md:text-lg md:leading-8">
          {vision.body}
        </p>
      </div>
    </section>
  );
}
