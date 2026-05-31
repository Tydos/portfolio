import './globals.css';
import Script from 'next/script';
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
      <head>
        <Script
          src="https://kit.fontawesome.com/55bd236693.js"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistSans.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
