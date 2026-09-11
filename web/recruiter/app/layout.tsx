import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { SITE } from "../constants/config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

/** Root document metadata (title, Open Graph, Twitter card). */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: SITE.title,
    template: `%s · ${SITE.title}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE.title,
    title: SITE.title,
    description: SITE.description,
    images: [
      { url: SITE.ogImage, width: 360, height: 440, alt: "Prasad Jawale" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
};

/**
 * Root HTML shell: Geist Sans, Analytics, and page children.
 *
 * @param props.children - Nested App Router page content.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistSans.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
