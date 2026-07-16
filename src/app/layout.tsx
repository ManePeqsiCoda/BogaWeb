import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import {
  siteConfig,
  seoConfig,
  generateOrganizationJsonLd,
  generateLocalBusinessJsonLd,
  generateWebsiteJsonLd,
  generateOpenGraph,
  generateTwitterCard,
} from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Junisama",
    default: seoConfig.home.title,
  },
  description: seoConfig.home.description,
  keywords: seoConfig.home.keywords,
  authors: [{ name: siteConfig.fullName }],
  creator: siteConfig.fullName,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  openGraph: generateOpenGraph("home"),
  twitter: generateTwitterCard("home"),
  other: {
    "content-language": siteConfig.language,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    generateOrganizationJsonLd(),
    generateLocalBusinessJsonLd(),
    generateWebsiteJsonLd(),
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.language}
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <meta httpEquiv="content-language" content={siteConfig.language} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.google.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
