import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  async redirects() {
    return [
      // Unificación: productos → servicios
      {
        source: "/productos",
        destination: "/servicios",
        permanent: true,
      },
      {
        source: "/productos/:slug",
        destination: "/servicios/:slug",
        permanent: true,
      },
      // Slugs legacy de servicios antiguos
      {
        source: "/servicios/banos-portatiles-vip",
        destination: "/servicios/bano-vip",
        permanent: true,
      },
      {
        source: "/servicios/banos-portatiles-estandar",
        destination: "/servicios/bano-estandar",
        permanent: true,
      },
      {
        source: "/servicios/banos-para-discapacitados",
        destination: "/servicios/discapacitados",
        permanent: true,
      },
      {
        source: "/servicios/banos-portatiles-electricos",
        destination: "/servicios/electricos",
        permanent: true,
      },
      {
        source: "/servicios/lavamanos-aquastand-aquapop",
        destination: "/servicios/lavamanos",
        permanent: true,
      },
      {
        source: "/servicios/trailer-de-lujo",
        destination: "/servicios/trailer-lujo",
        permanent: true,
      },
      {
        source: "/servicios/servicio-de-operarios",
        destination: "/servicios/operarios",
        permanent: true,
      },
      // Alias de cotización
      {
        source: "/cotizar",
        destination: "/cotizacion",
        permanent: true,
      },
      // Alias quienes-somos
      {
        source: "/nosotros",
        destination: "/quienes-somos",
        permanent: true,
      },
    ];
  },
  async headers() {
    const isProduction = process.env.NODE_ENV === "production";

    const securityHeaders = [
      {
        // SAMEORIGIN: permite que /pitch embeba el prototipo del mismo deploy
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
    ];

    if (isProduction) {
      securityHeaders.push({
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
          "style-src 'self' 'unsafe-inline' https:",
          "img-src 'self' data: blob: https:",
          "font-src 'self' https: data:",
          "frame-src 'self' https://www.google.com https://www.google.com/maps https://maps.google.com https://wuundeer-prototype.vercel.app https://real-seguros-web.vercel.app https://siraitia.shop https://manepeqsicoda.github.io",
          "connect-src 'self' https://vitals.vercel-insights.com https://www.google.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      });
    }

    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/pitch",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/pitch/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
