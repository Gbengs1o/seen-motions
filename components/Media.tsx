import Image from 'next/image';

type MediaProps = {
  url: string;
  type?: string;
  alt: string;
  className?: string;
};

export default function Media({ url, type, alt, className }: MediaProps) {
  if (type === 'video') {
    return (
      <video
        className={className}
        src={url}
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    );
  }

  return (
    <Image
      className={className}
      src={url}
      alt={alt}
      fill
      sizes="(max-width: 900px) 100vw, 60vw"
      style={{
        objectFit: 'cover',
      }}
    />
  );
}