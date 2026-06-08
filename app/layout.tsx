import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Seen Motions',
  description: 'Design in Motion. Impact in Seconds.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
