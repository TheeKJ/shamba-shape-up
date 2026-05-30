import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AppToaster } from './toaster';
import './globals.css'; 

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Shamba | The Agricultural Trust Infrastructure',
  description: 'AI-powered agricultural investment platform connecting urban capital to rural productivity through group pools, verified listings, and trust scoring.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning className="bg-[#FDFCFB] text-[#1B3022] font-sans antialiased">
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
