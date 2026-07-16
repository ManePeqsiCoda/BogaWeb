import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://junisama.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productos = await prisma.producto.findMany({
    where: { estado: "ACTIVO" },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/productos", priority: 0.9, changeFrequency: "weekly" },
    { path: "/servicios", priority: 0.9, changeFrequency: "weekly" },
    { path: "/quienes-somos", priority: 0.8, changeFrequency: "monthly" },
    { path: "/galeria", priority: 0.8, changeFrequency: "monthly" },
    { path: "/clientes", priority: 0.8, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contacto", priority: 0.8, changeFrequency: "monthly" },
    { path: "/cotizacion", priority: 0.9, changeFrequency: "monthly" },
    { path: "/privacidad", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terminos", priority: 0.4, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.4, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route.path}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...productos.map((producto) => ({
      url: `${BASE_URL}/productos/${producto.slug}`,
      lastModified: producto.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
