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
      // Redirecciones de servicios antiguos a productos
      {
        source: "/servicios/banos-portatiles-vip",
        destination: "/productos/bano-vip",
        permanent: true,
      },
      {
        source: "/servicios/banos-portatiles-estandar",
        destination: "/productos/bano-estandar",
        permanent: true,
      },
      {
        source: "/servicios/banos-para-discapacitados",
        destination: "/productos/discapacitados",
        permanent: true,
      },
      {
        source: "/servicios/banos-portatiles-electricos",
        destination: "/productos/electricos",
        permanent: true,
      },
      {
        source: "/servicios/lavamanos-aquastand-aquapop",
        destination: "/productos/lavamanos",
        permanent: true,
      },
      {
        source: "/servicios/trailer-de-lujo",
        destination: "/productos/trailer-lujo",
        permanent: true,
      },
      {
        source: "/servicios/servicio-de-operarios",
        destination: "/productos/operarios",
        permanent: true,
      },
      {
        source: "/servicios/puntos-ecologicos",
        destination: "/productos/puntos-ecologicos",
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
        key: "X-Frame-Options",
        value: "DENY",
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
          "frame-src 'self' https://www.google.com https://www.google.com/maps https://maps.google.com",
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
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
