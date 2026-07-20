import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: {
    template: "%s | BOGA",
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
    "geo.region": "CO",
    "geo.placename": "Medellín, Bogotá",
    "geo.position": "6.2518;-75.5636",
    ICBM: "6.2518, -75.5636",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/LogoBOGA.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/LogoBOGA.svg",
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
      className="h-full antialiased"
      suppressHydrationWarning
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
