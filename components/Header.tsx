type HeaderProps = {
  brand: string;
  nav: string[];
};

export default function Header({ brand, nav }: HeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#top">
        {brand}
      </a>

      <nav>
        {nav.map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`}>
            {item}
          </a>
        ))}
      </nav>

      <a className="darkButton" href="mailto:hello@seenmotions.com">
        GET IN TOUCH
      </a>
    </header>
  );
}