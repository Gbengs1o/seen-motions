type VisionProps = {
  vision: {
    title: string;
    body: string;
  };
};

export default function Vision({ vision }: VisionProps) {
  return (
    <section id="studio" className="vision">
      <h2>{vision.title}</h2>
      <p>{vision.body}</p>
    </section>
  );
}