import Image from 'next/image';

type MediaProps = {
  url: string;
  type?: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
};

export default function Media({ url, type, alt, className, loading = 'lazy' }: MediaProps) {
  if (type === 'video') {
    return (
      <video
        className={`h-full w-full object-cover ${className ?? ''}`}
        src={url}
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  return (
    <div className={`relative h-full w-full ${className ?? ''}`}>
      <Image
        src={url}
        alt={alt}
        fill
        loading={loading}
        sizes="(max-width: 900px) 100vw, 60vw"
        className="object-cover"
      />
    </div>
  );
}
