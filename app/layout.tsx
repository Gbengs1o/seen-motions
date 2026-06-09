import type { Metadata } from 'next';
import './globals.css';
import PremiumCursor from '@/components/PremiumCursor';

export const metadata: Metadata = {
  title: 'Seen Motions',
  description: 'Design in Motion. Impact in Seconds.',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <PremiumCursor />
      </body>
    </html>
  );
}
