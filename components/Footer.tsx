type FooterProps = {
  brand: string;
  footer: {
    links: string[];
    copyright: string;
  };
};

export default function Footer({ brand, footer }: FooterProps) {
  return (
    <footer>
      <strong>{brand}</strong>

      <div className="footerLinks">
        {footer.links.map((link) => (
          <a key={link}>{link}</a>
        ))}
      </div>

      <p>{footer.copyright}</p>
    </footer>
  );
}