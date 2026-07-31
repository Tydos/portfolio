import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { GeistSans } from 'geist/font/sans';

export const metadata = {
  title: "Prasad's Portfolio",
  description: 'Portfolio Page',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistSans.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
