import type { Metadata, Viewport } from 'next';
import { Manrope, Sora } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const headingFont = Sora({ subsets: ['latin'], variable: '--font-heading' });
const bodyFont = Manrope({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'BudgedIn',
  description: 'Manajemen Keuangan Cerdas untuk Mahasiswa',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BudgedIn'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#22C55E'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${headingFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
