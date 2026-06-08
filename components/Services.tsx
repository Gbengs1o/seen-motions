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
    <section id="services" className="services">
      <h2>SERVICES</h2>

      <div className="serviceGrid">
        {services.map((service) => (
          <article key={service.number}>
            <span className="number">{service.number}</span>

            <h3>
              {service.title.split('\n').map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>

            <p>{service.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}