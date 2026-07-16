# Documento Maestro: Estado actual del proyecto Junisama (pre-rebrand)

> **Propósito:** Este documento es una radiografía completa del sitio web de Junisama tal como está en `main` después de las Fases A–F. Sirve como punto de partida para el rebrand de marca y para cualquier rediseño total de estilos. Incluye arquitectura, sistema de diseño, componentes, datos, SEO, assets, valores hardcodeados, riesgos y recomendaciones.
>
> **Última actualización:** 2026-07-16 (commit `e753a58`)

---

## 1. Resumen ejecutivo

El proyecto es un sitio corporativo + panel administrativo construido con **Next.js 16.2.10 (App Router)**, **React 19**, **Tailwind CSS v4** y **TypeScript**. La identidad visual actual se basa en:

- **Primary:** naranja industrial `#e85d24`.
- **Secondary:** azul marino oscuro `#0f1923`.
- **Accent:** dorado certificación `#c9a84c`.
- **Fuentes:** Outfit (cuerpo y títulos) + Space Grotesk (métricas).
- **Feel:** industrial, confiable, premium, ambientalmente consciente.

El sitio tiene una landing page, catálogo de productos, galería de eventos, cotización, contacto, FAQ y páginas legales. El panel admin (`/admin/*`) es un CRM ligero con mock-auth y temas oscuros separados.

**Puntos críticos para el rebrand:**
1. Los tokens viven en `src/app/globals.css` y están bien centralizados, **pero** hay muchos colores hex literales en SVG, admin y páginas sueltas.
2. El logo, favicon y marca visual están hardcodeados en SVG y archivos generados.
3. La información de contacto y el contenido corporativo están duplicados en ~6–10 archivos.
4. La mayoría de las imágenes (productos, hero, OG, quienes-somos) son placeholders generados por script; solo las fotos reales de eventos faltan completamente.
5. La página `/design-system` tiene valores desactualizados que no coinciden con el sistema real.
6. El admin usa una paleta oscura separada (`data-admin-theme="dark"`) con dorado como primary.

---

## 2. Stack tecnológico y configuración base

| Área | Tecnología / Archivo | Notas |
|------|----------------------|-------|
| Framework | Next.js 16.2.10 | App Router, SSG + rutas dinámicas |
| React | 19.2.4 | Uso de Server Components y Client Components |
| Estilos | Tailwind CSS v4 | Configuración vía CSS (`@theme inline`), `tailwind.config.ts` solo como referencia |
| UI kit | `@base-ui/react` (shadcn “base-nova”) | Componentes en `src/components/ui/*` |
| Animaciones | `framer-motion` | Hero, fade-ins, transiciones |
| Formularios | `react-hook-form` + `zod` | Cotización, contacto, login, formularios admin |
| Tablas | `@tanstack/react-table` | Admin (productos, clientes, cotizaciones) |
| Autenticación | `next-auth` (beta) + mock-auth en `src/lib/auth-mock.tsx` | Credenciales en variables públicas (`NEXT_PUBLIC_*`) |
| DB ORM | Prisma | Esquema en `prisma/` (no auditado en profundidad) |
| Tipografía | Google Fonts (Outfit + Space Grotesk) | Importadas en `src/app/globals.css` |
| Íconos | `lucide-react` | También SVG inline en footer y logo |

Archivos clave de configuración:

- `next.config.ts` — imágenes, redirects, headers de seguridad, CSP.
- `postcss.config.mjs` — Tailwind v4.
- `tsconfig.json` — alias `@/*` apuntando a `src/`.
- `components.json` — registro de shadcn/base-ui; estilo `base-nova`, icon library `lucide`.

---

## 3. Arquitectura de carpetas

```
src/
├── app/                  # App Router: páginas, layouts, metadatos
│   ├── admin/            # Panel administrativo
│   ├── clientes/         # Testimonios y clientes
│   ├── contacto/         # Formulario de contacto
│   ├── cotizacion/       # Wizard de cotización
│   ├── cotizar/          # Stub (redirect en next.config.ts)
│   ├── design-system/    # Página interna de tokens (DESACTUALIZADA)
│   ├── faq/              # Preguntas frecuentes
│   ├── galeria/          # Galería de eventos
│   ├── productos/        # Catálogo y detalle de productos
│   ├── quienes-somos/    # Página corporativa
│   ├── servicios/        # Página de servicios
│   ├── cookies/          # Legal
│   ├── privacidad/       # Legal
│   ├── terminos/         # Legal
│   ├── layout.tsx        # Root layout, metadata, JSON-LD global
│   ├── page.tsx          # Home page
│   ├── robots.ts         # robots.txt dinámico
│   └── sitemap.ts        # sitemap.xml dinámico
├── components/
│   ├── admin/            # Componentes del panel admin
│   ├── home/             # Componentes de la home
│   ├── layout/           # Navbar, Footer, WhatsApp, Admin shell
│   ├── ui/               # Componentes base-ui/shadcn
│   ├── client-marquee.tsx
│   ├── logo.tsx
│   ├── our-numbers.tsx
│   ├── product-card.tsx
│   └── product-grid.tsx
├── data/
│   └── events.ts         # 50 eventos reales (requieren autorización)
├── lib/
│   ├── auth-mock.tsx     # Auth mock (⚠️ credenciales públicas)
│   ├── mocks.ts          # Base de datos en memoria
│   ├── seo.ts            # Configuración SEO central
│   ├── slugify.ts
│   └── utils.ts
├── types/                # Tipos globales (no auditado en detalle)
public/
├── favicon.*, logo.svg   # Assets de marca
├── images/               # Imágenes del sitio
└── ...                   # Iconos por defecto de Next.js
scripts/
└── generate-placeholders.py  # Generador de imágenes placeholder
```

---

## 4. Routing y páginas

### 4.1 Rutas públicas

| Ruta | Archivo | Componente principal | Observación |
|------|---------|--------------------|-------------|
| `/` | `src/app/page.tsx` | `Hero`, `ClientMarquee`, `ProductGrid`, `WhyUs`, `OurNumbers`, `Contact` | Landing page |
| `/productos` | `src/app/productos/page.tsx` | `ProductCatalog` | Filtros por categoría |
| `/productos/[slug]` | `src/app/productos/[slug]/page.tsx` | Detalle de producto | SSG vía `generateStaticParams` |
| `/servicios` | `src/app/servicios/page.tsx` | Servicios | 4 cards + diferenciadores |
| `/quienes-somos` | `src/app/quienes-somos/page.tsx` | Historia, compromisos, sedes | Mapas embebidos |
| `/galeria` | `src/app/galeria/page.tsx` | `GalleryGrid` | Filtros por año y tipo |
| `/clientes` | `src/app/clientes/page.tsx` | Testimonios y clientes | Nombres de terceros hardcodeados |
| `/faq` | `src/app/faq/page.tsx` | `FaqAccordion` | FAQ desde `mocks.ts` |
| `/contacto` | `src/app/contacto/page.tsx` | `ContactForm` | Formulario + mapas |
| `/cotizacion` | `src/app/cotizacion/page.tsx` | `QuoteWizard` | Wizard de 3 pasos |
| `/cotizar` | `src/app/cotizar/page.tsx` | Stub | Redirige a `/cotizacion` |
| `/design-system` | `src/app/design-system/page.tsx` | Design system | **Valores desactualizados** |
| `/privacidad`, `/terminos`, `/cookies` | `src/app/*/page.tsx` | Legal | Textos estáticos |

### 4.2 Rutas administrativas

| Ruta | Archivo | Función |
|------|---------|---------|
| `/admin/login` | `src/app/admin/login/page.tsx` | Login mock |
| `/admin` | `src/app/admin/page.tsx` | Dashboard con KPIs |
| `/admin/productos` | `src/app/admin/productos/page.tsx` | CRUD productos |
| `/admin/clientes` | `src/app/admin/clientes/page.tsx` | CRUD clientes |
| `/admin/clientes/[id]` | `src/app/admin/clientes/[id]/page.tsx` | Detalle cliente |
| `/admin/cotizaciones` | `src/app/admin/cotizaciones/page.tsx` | Listado cotizaciones |
| `/admin/cotizaciones/[id]` | `src/app/admin/cotizaciones/[id]/page.tsx` | Detalle cotización |
| `/admin/cotizaciones/nueva` | `src/app/admin/cotizaciones/nueva/page.tsx` | Nueva cotización |
| `/admin/eventos` | `src/app/admin/eventos/page.tsx` | CRUD eventos |
| `/admin/config`, `/admin/configuracion` | `src/app/admin/config/page.tsx`, `configuracion/page.tsx` | Configuración duplicada? |

### 4.3 Redirects configurados en `next.config.ts`

- `/servicios/banos-portatiles-vip` → `/productos/bano-vip`
- `/servicios/banos-portatiles-estandar` → `/productos/bano-estandar`
- `/servicios/banos-para-discapacitados` → `/productos/discapacitados`
- `/servicios/banos-portatiles-electricos` → `/productos/electricos`
- `/servicios/lavamanos-aquastand-aquapop` → `/productos/lavamanos`
- `/servicios/trailer-de-lujo` → `/productos/trailer-lujo`
- `/servicios/servicio-de-operarios` → `/productos/operarios`
- `/servicios/puntos-ecologicos` → `/productos/puntos-ecologicos`
- `/cotizar` → `/cotizacion`
- `/nosotros` → `/quienes-somos`

---

## 5. Sistema de diseño y tokens

### 5.1 Fuente de verdad

**`src/app/globals.css`** es la fuente de verdad del tema. Tailwind v4 carga la configuración desde `@theme inline` (líneas 17–216) y las variables semánticas en `:root` (líneas 218–288). `tailwind.config.ts` se mantiene solo como documentación.

### 5.2 Paleta de colores actual

| Rol | Token base | Valor HEX | Uso |
|-----|------------|-----------|-----|
| Primary | `--primary` | `#e85d24` | Botones CTA, focus rings, acentos, links |
| Primary hover | `--primary-hover` | `#d14d18` | Hover de botones |
| Primary light | `--primary-light` | `#fff0e8` | Superficies claras, badges |
| Secondary | `--secondary` | `#0f1923` | Fondos oscuros, footer, navbar, hero overlay |
| Secondary elevated | `--secondary-elevated` | `#1a2634` | Cards sobre fondos oscuros |
| Accent gold | `--accent-gold` | `#c9a84c` | Badges ISO, stats premium, estrellas |
| Emergency | `--emergency-500` | `#dc2626` | Botón EMERGENCIA |
| Body | `--body` | `#5a6779` | Texto de cuerpo |
| Muted | `--muted` | `#8896a8` | Texto secundario |
| Dark | `--dark` | `#0f1923` | Títulos claros |
| Background | `--background` | `#ffffff` | Fondo general |
| BG light | `--bg-light` | `#f6f7f9` | Secciones alternadas |
| BG warm | `--bg-warm` | `#faf9f7` | Secciones cálidas |
| WhatsApp | `--whatsapp` | `#25d366` | Botón flotante |
| Success | `--success` | `#16a34a` | Estados positivos |
| Error | `--error` | `#dc2626` | Estados de error |
| Warning | `--warning` | `#eab308` | Advertencias |

### 5.3 Escala de grises (Tailwind neutral)

- `neutral-50` → `#fafafa`
- `neutral-100` → `#f5f5f5`
- `neutral-200` → `#e5e5e5`
- `neutral-300` → `#d4d4d4`
- `neutral-400` → `#a3a3a3`
- `neutral-500` → `#737373`
- `neutral-600` → `#525252`
- `neutral-700` → `#404040`
- `neutral-800` → `#262626`
- `neutral-900` → `#171717`

### 5.4 Tipografía

| Token | Tamaño | Uso |
|-------|--------|-----|
| `display-xl` | `4.5rem` | — |
| `display-lg` | `3.75rem` | — |
| `display-md` | `3rem` | H1 hero |
| `heading-lg` | `2.25rem` | H2 sección |
| `heading-md` | `1.5rem` | H3 tarjetas |
| `heading-sm` | `1.25rem` | H4 subtítulos |
| `body-lg` | `1.125rem` | Párrafos destacados |
| `body-md` | `1rem` | Párrafos estándar |
| `body-sm` | `0.875rem` | Textos pequeños |
| `caption` | `0.75rem` | Labels, uppercase |

**Fuentes:** `Outfit` (principal y títulos) y `Space Grotesk` (números y métricas).

### 5.5 Clases custom (`@layer components` en `globals.css`)

| Clase | Descripción | Línea aproximada |
|-------|-------------|------------------|
| `.container-junisama` | Contenedor max 1280px con padding variable | 425 |
| `.badge-iso` | Badge dorado con fondo translúcido | 435 |
| `.btn-primary` | Botón sólido naranja, full-pill | 452 |
| `.btn-secondary` | Botón outline blanco (asume fondo oscuro) | 485 |
| `.btn-emergency` | Botón rojo pulso | 508 |
| `.card-product` | Card de producto con hover y aspect 4:3 | 538 |
| `.stat-number` | Número dorado grande | 571 |
| `.marquee-container` | Máscara de fade para marquee | 586 |
| `.marquee-track` | Track animado del marquee | 604 |

### 5.6 Utilities custom (`@layer utilities`)

- `.gradient-primary` — gradiente primary a primary-hover.
- `.gradient-dark` — gradiente secondary a `#0a1018`.
- `.surface-elevated` / `.surface-floating` — sombras.
- `.text-balance` — `text-wrap: balance`.

### 5.7 Modo oscuro y tema admin

- `.dark` (líneas 302–323): redefine variables semánticas para un tema oscuro público. **No se usa actualmente** (el `ThemeProvider` tiene `defaultTheme="light"`).
- `[data-admin-theme="dark"]` (líneas 325–363): tema exclusivo del panel admin. Primary dorado `#d4a853`, fondo `#0a0a0a`.

### 5.8 Animaciones y motion

- `pulse-emergency` — sombra pulsante roja.
- `marquee` / `marquee-reverse` — scroll infinito.
- `prefers-reduced-motion` desactiva animaciones y transiciones.

---

## 6. Inventario de componentes

### 6.1 Layout y shell

| Componente | Archivo | Responsabilidad | Riesgo para rebrand |
|------------|---------|-----------------|----------------------|
| `RootLayout` | `src/app/layout.tsx` | Metadata, JSON-LD, fuentes, favicon | Medio |
| `Providers` | `src/components/providers.tsx` | ThemeProvider, Navbar, Footer, WhatsApp, skip-link, offset `pt-[72px]` | Medio |
| `Navbar` | `src/components/layout/navbar.tsx` | Header fijo, dropdown, menú móvil, EMERGENCIA | **Alto** |
| `Footer` | `src/components/layout/footer.tsx` | Footer oscuro, CTA, mapas, redes, admin link | **Alto** |
| `WhatsAppButton` | `src/components/layout/whatsapp-button.tsx` | Botón flotante | Medio |
| `AdminHeader` | `src/components/layout/admin-header.tsx` | Header admin | Medio |
| `AdminSidebar` | `src/components/layout/admin-sidebar.tsx` | Sidebar admin 260px | Medio |
| `Logo` | `src/components/logo.tsx` | SVG de marca con colores fijos | **Alto** |
| `AdminLink` | `src/components/admin-link.tsx` | Link discreto al admin | Bajo |
| `FadeIn` | `src/components/home/fade-in.tsx` | Wrapper de animación Framer Motion | Bajo |

### 6.2 Home page

| Componente | Archivo | Función | Notas clave |
|------------|---------|---------|-------------|
| `Hero` | `src/components/home/hero.tsx` | Hero principal | TODO ISO, TODO foto real, stats hardcodeados |
| `ClientMarquee` | `src/components/client-marquee.tsx` | Marquee infinito de eventos | Usa `src/data/events.ts` |
| `ProductGrid` + `ProductCard` | `src/components/product-grid.tsx`, `product-card.tsx` | Grid de productos destacados | Imágenes placeholder |
| `WhyUs` | `src/components/home/why-us.tsx` | Sección oscura de diferenciadores | Fondo `bg-secondary` |
| `OurNumbers` | `src/components/our-numbers.tsx` | Stats dorados | Valores hardcodeados |
| `Contact` | `src/components/home/contact.tsx` | Formulario de contacto + info | Datos hardcodeados |
| `Clients` | `src/components/home/clients.tsx` | Grid de clientes | **No se usa en home** |
| `Testimonials` | `src/components/home/testimonials.tsx` | Testimonios | **No se usa en home** |
| `FeaturedProducts` | `src/components/home/featured-products.tsx` | Productos con iconos | **No se usa en home** |

### 6.3 Páginas de catálogo y cotización

| Componente | Archivo | Función | Notas |
|------------|---------|---------|-------|
| `ProductCatalog` | `src/app/productos/product-catalog.tsx` | Filtros y grid de productos | Tabs `bg-primary` |
| `QuoteWizard` | `src/app/cotizacion/quote-wizard.tsx` | Wizard de 3 pasos | Uso de `document.forms` mezclado |
| `ContactForm` | `src/app/contacto/contact-form.tsx` | Formulario + mapas | Datos hardcodeados |
| `FaqAccordion` | `src/app/faq/faq-accordion.tsx` | Acordeón FAQ | — |
| `GalleryGrid` | `src/app/galeria/gallery-grid.tsx` | Galería de eventos | Colores de tipo hardcodeados |

### 6.4 UI base (shadcn/base-ui)

`src/components/ui/` contiene: `button`, `card`, `badge`, `input`, `textarea`, `select`, `label`, `checkbox`, `accordion`, `tabs`, `dialog`, `sheet`, `drawer`, `alert`, `avatar`, `breadcrumb`, `dropdown-menu`, `navigation-menu`, `scroll-area`, `separator`, `skeleton`, `sonner`, `table`.

**Importante:** estos componentes usan variables CSS (`bg-primary`, `text-primary-foreground`, etc.), por lo que se adaptarán automáticamente si los tokens cambian. Sin embargo, `button.tsx` default size es `h-8 px-2.5` (muy pequeño vs. `.btn-primary`).

### 6.5 Admin

| Componente | Archivo | Riesgo para rebrand |
|------------|---------|----------------------|
| `status-badge.tsx` | `src/components/admin/status-badge.tsx` | Hex literales `#22C55E`, `#EF4444`, `#3B82F6`, `#F59E0B` |
| `kpi-card.tsx` | `src/components/admin/kpi-card.tsx` | Hex literales en tendencias |
| `cotizaciones-status-chart.tsx` | `src/components/admin/cotizaciones-status-chart.tsx` | Hex literales |
| `producto-form.tsx` | `src/components/admin/producto-form.tsx` | Placeholder de imagen hardcodeado |
| `cliente-form.tsx` | `src/components/admin/cliente-form.tsx` | — |
| `evento-form.tsx` | `src/components/admin/evento-form.tsx` | — |
| `evento-portafolio-form.tsx` | `src/components/admin/evento-portafolio-form.tsx` | — |
| `recent-cotizaciones.tsx` | `src/components/admin/recent-cotizaciones.tsx` | — |
| `cotizacion-wizard.tsx` | `src/components/admin/cotizacion-wizard.tsx` | Hex literales de ganancia/pérdida |

---

## 7. Datos y dominio

### 7.1 `src/lib/mocks.ts` — base de datos en memoria

Este archivo es el **corazón del contenido** del prototipo. Contiene:

- **Tipos exportados:** `Producto`, `Cliente`, `Cotizacion`, `Evento`, `Usuario`, `Configuracion`, `Faq`, `Categoria`, etc.
- **Arrays exportados:** `categorias`, `productos`, `clientes`, `eventos`, `usuarios`, `cotizaciones`, `faqs`, `configuracion`.
- **Helpers:** `getProductoBySlug`, `getProductosDestacados`, `getProductosByCategoria`, `getClienteById`, `getCotizacionById`, `getEventoById`, `getEventoBySlug`, `getFaqsByCategoria`, `generateMockId`, `CURRENT_YEAR`, `getCurrentTimestamp`, `parseDateToISO`.

**Productos actuales (8):**

| Slug | Nombre | Categoría | Precio base | Badge |
|------|--------|-----------|-------------|-------|
| `bano-vip` | Baño Portátil VIP | Baños portátiles | $450.000 | Premium |
| `bano-estandar` | Baño Portátil Estándar | Baños portátiles | $180.000 | Más popular |
| `discapacitados` | Baño para Discapacitados | Baños portátiles | $320.000 | Inclusivo |
| `electricos` | Baños Eléctricos | Baños portátiles | $280.000 | Tecnología |
| `lavamanos` | Lavamanos Portátil | Lavamanos | $150.000 | — |
| `trailer-lujo` | Trailer de Lujo | Baños portátiles | $2.500.000 | Alto volumen |
| `operarios` | Servicio de Operarios | Servicios | $180.000 / turno | — |
| `puntos-ecologicos` | Puntos Ecológicos | Puntos ecológicos | $220.000 | Sostenible |

**Configuración del sitio (`configuracion`):**

- `nombreSitio`: "Junisama Inversiones S.A.S"
- `telefono`: "+57 350 708 9584"
- `email`: "soporte@junisama.com"
- `whatsappNumero`: "573507089584"
- `direccionMedellin`: "Calle 13 sur #51C-54"
- `direccionBogota`: "Cra 58b bis # 131A 51"
- `instagramUrl`: "https://instagram.com/junisama" (⚠️ desactualizado vs. `@junisama_inversiones`)
- `linkedinUrl`: "https://linkedin.com/company/junisama" (⚠️ desactualizado)
- `seoTitleDefault`, `seoDescriptionDefault`, `mensajeWhatsApp`.

**Inconsistencia de redes sociales:** `mocks.ts` usa URLs cortas, pero el footer y `seo.ts` usan los handles oficiales (`junisama_inversiones`, `inversiones-junisama-s-a-s`).

### 7.2 `src/data/events.ts` — portafolio de eventos

- Interfaz `Event`: `id`, `name`, `years`, `type`, `highlighted`.
- **50 eventos** con marcas como Shakira, Foo Fighters, Feria de las Flores, Papa Francisco, Estéreo Picnic, Rock al Parque, Soda Stereo, Carl Cox, Alvaro Díaz, etc.
- Cada línea tiene comentario `// REQUIERE AUTORIZACIÓN`.
- No tienen imágenes asociadas; la galería muestra placeholders.

### 7.3 Autenticación (`src/lib/auth-mock.tsx`)

- Usa `process.env.NEXT_PUBLIC_ADMIN_EMAIL` y `process.env.NEXT_PUBLIC_PASSWORD`.
- **Riesgo de seguridad:** credenciales en variables públicas del bundle.
- El login real en `src/app/admin/login/page.tsx` muestra un hint en desarrollo.

---

## 8. SEO y metadatos

### 8.1 `src/lib/seo.ts` — configuración central

- `siteConfig`: nombre, tagline, URL, logo, teléfono, email, WhatsApp, locale, idioma, direcciones.
- `url`: `https://junisama.com.co` ✅ dominio correcto.
- `logo`: `https://junisama.com.co/logo.svg`.
- `sameAs`: Instagram y LinkedIn oficiales.
- `seoConfig`: títulos, descripciones y keywords para cada página.
- Generadores: `generateOpenGraph`, `generateTwitterCard`, `generateOrganizationJsonLd`, `generateLocalBusinessJsonLd`, `generateWebsiteJsonLd`, `generateBreadcrumbJsonLd`, `generateContactPageJsonLd`.

### 8.2 Layout raíz (`src/app/layout.tsx`)

- Title template: `%s | Junisama`.
- `metadataBase: new URL(siteConfig.url)`.
- `alternates.canonical: "/"`.
- Geo tags: `geo.region: "CO"`, `geo.placename: "Medellín, Bogotá"`, `geo.position: "6.2518;-75.5636"`, `ICBM: "6.2518, -75.5636"`.
- Favicon: `icon: "/favicon.svg"`, `shortcut: "/favicon.ico"`.
- Preconnects: Google Fonts, Google, Google Maps, WhatsApp.
- JSON-LD global: Organization + LocalBusiness + WebSite.

### 8.3 Sitemap y robots

- `src/app/sitemap.ts`: `BASE_URL` fallback a `https://junisama.com` (⚠️ **inconsistencia con `.com.co`**).
- `src/app/robots.ts`: mismo fallback inconsistente.
- Disallow: `/admin`, `/admin/*`, `/api/*`.

### 8.4 Metadatos por página

Todas las páginas públicas exportan `metadata` con título, descripción, keywords, canonical, OG y Twitter. Excepción: `/cotizar` tiene metadata local hardcodeada.

### 8.5 JSON-LD por página

| Página | Schemas |
|--------|---------|
| Layout | Organization, LocalBusiness, WebSite |
| `/productos` | BreadcrumbList |
| `/productos/[slug]` | BreadcrumbList, Product |
| `/servicios` | BreadcrumbList, Service |
| `/galeria` | BreadcrumbList |
| `/clientes` | BreadcrumbList |
| `/quienes-somos` | BreadcrumbList |
| `/faq` | BreadcrumbList, FAQPage |
| `/contacto` | BreadcrumbList, ContactPage |
| `/cotizacion` | BreadcrumbList |

---

## 9. Inventario de assets

### 9.1 Brand assets (raíz de `public/`)

| Archivo | Estado | Observación |
|---------|--------|-------------|
| `public/logo.svg` | SVG con colores fijos | Rect `#0F1923`, triángulos `#E85D24` y `#C9A84C` |
| `public/favicon.svg` | SVG con colores fijos | Mismo palette |
| `public/favicon.ico` | Generado | ⚠️ Usa `#0ea5e9` (azul cielo) en el script, no el naranja de marca |
| `public/next.svg`, `public/vercel.svg`, `public/window.svg`, `public/file.svg`, `public/globe.svg` | Default Next.js | Probablemente sin usar; se pueden eliminar |

### 9.2 Imágenes (`public/images/`)

| Carpeta / Archivo | Estado | Dimensiones | Uso |
|-------------------|--------|-------------|-----|
| `hero-background.jpg` | Placeholder generado | 1920×1080 | Hero en `src/components/home/hero.tsx` |
| `og-image.jpg` | Placeholder generado | 1200×630 | OG/Twitter en `src/lib/seo.ts` |
| `og-image.png` | Placeholder antiguo | 1200×630 | Ya no referenciado en código (`.jpg` se usa) |
| `og-image.svg` | Placeholder antiguo | — | Sin referencia en código |
| `products/*.jpg` (8 archivos) | Placeholders generados | 800×600 | Catálogo y detalle de productos |
| `quienes-somos/equipo.jpg` | Placeholder generado | 800×600 | Página quienes-somos |
| `quienes-somos/servicio-tecnico.jpg` | Placeholder generado | 800×600 | Página quienes-somos |
| `eventos/placeholder.svg` | Placeholder único | 800×600 | Todos los eventos en `mocks.ts` |

### 9.3 Generador de placeholders

`scripts/generate-placeholders.py` crea todos los assets visuales mencionados arriba. Sus características:

- Colores de acento por producto **no coinciden** con la paleta de marca (ej. `#0ea5e9`, `#22c55e`, `#a855f7`).
- Fuentes Windows-only (`C:/Windows/Fonts/arial.ttf`).
- Background gradients `#1e293b` → `#0f172a`.
- Cada imagen incluye texto “FOTO REAL PENDIENTE”.

**Nota:** si se ejecuta el script, sobrescribe los assets existentes.

### 9.4 Assets reales faltantes

- Fotos de productos reales (8).
- Foto/video de hero real de evento Junisama.
- Fotos de eventos de la galería (50 eventos).
- Fotos del equipo para quienes-somos.
- OG image real con fotografía de marca.
- Logo/favicon actualizado con la nueva marca (si cambia).

---

## 10. Valores hardcodeados críticos para el rebrand

### 10.1 Identidad de marca

- Nombres: `Junisama`, `JUNISAMA`, `Junisama Inversiones S.A.S`.
- Tagline: “Infraestructura Sanitaria Industrial”.
- Logo SVG en `src/components/logo.tsx` y `public/logo.svg`.
- Favicon en `public/favicon.svg` / `public/favicon.ico`.

### 10.2 Contacto y ubicación

| Valor | Ubicaciones aproximadas | Frecuencia |
|-------|-------------------------|------------|
| `+57 350 708 9584` | navbar, footer, contacto, WhatsAppButton, mocks, seo, legales | ~19 |
| `soporte@junisama.com` | navbar, footer, contacto, mocks, seo, legales | ~11 |
| `573507089584` | WhatsAppButton, mocks, seo | ~5 |
| `Calle 13 sur #51C-54` | footer, contacto, quienes-somos, mocks, seo, legales | ~8 |
| `Cra 58b bis #131A 51` | footer, contacto, quienes-somos, mocks, seo, legales | ~8 |
| Instagram `@junisama_inversiones` | footer, seo.ts | ~3 |
| LinkedIn `inversiones-junisama-s-a-s` | footer, seo.ts | ~3 |

### 10.3 Estadísticas y datos de negocio

- Hero stats: `500+`, `24/7`, `99.9%`, `10+` (`src/components/home/hero.tsx`).
- Our numbers: `30+`, `500+`, `2`, `10+`, etc. (`src/components/our-numbers.tsx`).
- Clientes: `33+`, `500+`, `2`, `10+` (`src/app/clientes/page.tsx`).
- Precios en COP de productos (`src/lib/mocks.ts`).
- Cotizaciones de ejemplo con márgenes (`src/lib/mocks.ts`).

### 10.4 Contenido legal y corporativo

- Textos completos en `privacidad/page.tsx`, `terminos/page.tsx`, `cookies/page.tsx`.
- Menús de navegación y footer.
- FAQ hardcodeada en `src/lib/mocks.ts`.
- Testimonios ficticios en `src/app/clientes/page.tsx` y `src/components/home/testimonials.tsx`.

### 10.5 Colores hexadecimales fuera de tokens

| Ubicación | Colores | Impacto |
|-----------|---------|---------|
| `src/components/logo.tsx` | `#0F1923`, `#E85D24`, `#C9A84C` | **Alto** — marca |
| `src/components/home/hero.tsx` | `#ffffff` (patrón) | Medio |
| `src/app/design-system/page.tsx` | `#FF6B35`, `#1A202C`, `#D4A853`, etc. | Medio — página desactualizada |
| Admin (`status-badge`, `kpi-card`, `cotizaciones-status-chart`, páginas) | `#22C55E`, `#EF4444`, `#F59E0B`, `#3B82F6` | **Alto** — panel admin |
| `src/app/galeria/gallery-grid.tsx` | `purple-500`, `pink-500`, `blue-500`, `emerald-500`, `indigo-500` | Medio |
| `scripts/generate-placeholders.py` | `#0ea5e9`, `#22c55e`, `#a855f7`, etc. | Bajo (solo placeholders) |

### 10.6 Dimensiones y layout hardcodeados

- `--header-height: 72px` / `--header-height-mobile: 64px` (este último no se usa).
- `pt-[72px]` en `<main>` (`src/components/providers.tsx`).
- Hero `min-h-[90vh]` (`src/components/home/hero.tsx`).
- Sidebar admin `w-[260px]` (`src/components/layout/admin-sidebar.tsx`).
- Product card `aspect-ratio: 4/3` (`src/components/product-card.tsx` / `globals.css`).
- Footer maps `aspect-[16/9]` (`src/components/layout/footer.tsx`).

---

## 11. Inconsistencias, TODOs y riesgos detectados

### 11.1 TODOs directos en el código

| Archivo | Línea | TODO |
|---------|-------|------|
| `src/components/home/hero.tsx` | 16 | `ISO_CERTIFICATE_NUMBER = ""` — agregar número real de ISO 14001. |
| `src/components/home/hero.tsx` | 41 | Reemplazar hero background por foto/video real. |
| `src/components/product-card.tsx` | 16 | Subir fotos reales a `/public/images/products/`. |
| `src/components/product-card.tsx` | 35 | Reemplazar placeholder por foto real. |
| `src/app/galeria/gallery-grid.tsx` | 148 | Reemplazar placeholder por foto real del evento. |
| `src/components/admin/producto-form.tsx` | 418 | Placeholder de input de imagen hardcodeado. |

### 11.2 Inconsistencias documentadas

| Problema | Ubicación | Detalle |
|----------|-----------|---------|
| Design system desactualizado | `src/app/design-system/page.tsx` | Dice “Inter” y usa `#FF6B35`, `#1A202C`, `#D4A853` que no coinciden con `globals.css`. |
| Favicon color inconsistente | `scripts/generate-placeholders.py` | Genera `#0ea5e9` en lugar del naranja de marca. |
| URLs de redes sociales duplicadas | `src/lib/mocks.ts` vs. footer/SEO | Mocks usan handles cortos; footer/SEO usan oficiales. |
| Fallback de dominio inconsistente | `sitemap.ts`, `robots.ts` | Usan `https://junisama.com` mientras `siteConfig.url` usa `.com.co`. |
| Tamaño de botón shadcn vs. custom | `src/components/ui/button.tsx` | Default `h-8 px-2.5` vs. `.btn-primary` mucho más grande. |
| Header mobile sin uso | `globals.css` | `--header-height-mobile: 64px` no se aplica; `pt-[72px]` es fijo. |

### 11.3 Riesgos legales / de contenido

| Riesgo | Nivel | Detalle |
|--------|-------|---------|
| Nombres de artistas/eventos en `data/events.ts` | **Crítico** | 50 marcas de terceros con `// REQUIERE AUTORIZACIÓN`. |
| Testimonios ficticios | **Alto** | `clientes/page.tsx` y `testimonials.tsx` usan reseñas inventadas. |
| Credenciales admin públicas | **Alto** | `NEXT_PUBLIC_ADMIN_EMAIL` / `NEXT_PUBLIC_PASSWORD` en `.env.example` y `auth-mock.tsx`. |
| Imágenes placeholder en producción | **Crítico** | Hero, productos, OG, galería, quienes-somos no tienen fotos reales. |

---

## 12. Checklist de alto riesgo para el rebrand

Esta lista debe revisarse antes, durante y después del cambio de marca.

### 12.1 Tokens y estilos globales

- [ ] Decidir nueva paleta de colores (primary, secondary, accent, success, error, warning).
- [ ] Actualizar `src/app/globals.css` (`@theme inline` y `:root`).
- [ ] Sincronizar `tailwind.config.ts` con los nuevos tokens (aunque sea solo documentación).
- [ ] Actualizar modo oscuro `.dark` y tema admin `[data-admin-theme="dark"]` si aplica.
- [ ] Revisar contrastes WCAG para primary/secondary sobre fondos claros y oscuros.
- [ ] Decidir si se mantienen las fuentes Outfit + Space Grotesk o se cambian.
- [ ] Actualizar import de Google Fonts y preconnects en `layout.tsx` si cambian fuentes.
- [ ] Revisar sombras, radios y animaciones para que coincidan con el nuevo look.

### 12.2 Marca visual (SVG, favicon, logo)

- [ ] Diseñar nuevo logo y exportar SVG.
- [ ] Reemplazar `src/components/logo.tsx` o parametrizar colores por CSS variables.
- [ ] Reemplazar `public/logo.svg`, `public/favicon.svg`, `public/favicon.ico`.
- [ ] Asegurar que el logo tenga variantes light/dark funcionales.
- [ ] Generar nuevos OG images (`og-image.jpg` y posiblemente `.png`/`svg`).
- [ ] Eliminar iconos por defecto de Next.js (`next.svg`, `vercel.svg`, etc.) si no se usan.

### 12.3 Componentes de layout y home

- [ ] Rebrandear `Navbar`: colores, logo, menú, botón EMERGENCIA, dropdown de productos.
- [ ] Rebrandear `Footer`: paleta oscura, CTA, mapas, iconos sociales, admin link.
- [ ] Rebrandear `Hero`: nuevo fondo real, gradiente, patrón, tipografía, stats.
- [ ] Rebrandear `WhyUs` y `Contact` (secciones oscuras).
- [ ] Rebrandear `OurNumbers` (números dorados).
- [ ] Rebrandear `ProductCard` y `ProductGrid`.
- [ ] Rebrandear `ClientMarquee` (máscara y animación).
- [ ] Revisar `WhatsAppButton` si cambia el color de WhatsApp.

### 12.4 Páginas públicas

- [ ] `/productos` y `/productos/[slug]` — nuevas fotos, badges, tipografía.
- [ ] `/servicios` — iconos, cards, colores.
- [ ] `/quienes-somos` — nuevas fotos de equipo, mapas, tipografía.
- [ ] `/galeria` — fotos reales de eventos y colores por tipo de evento.
- [ ] `/clientes` — testimonios verificables o eliminarlos; revisar nombres de terceros.
- [ ] `/faq` — estilos de acordeón.
- [ ] `/contacto` — formulario, mapas, colores.
- [ ] `/cotizacion` — wizard, steps, colores.
- [ ] Páginas legales — tipografía y espaciado, mantener contenido legal.
- [ ] `/design-system` — **actualizar o eliminar** antes de publicar.

### 12.5 Panel administrativo

- [ ] Decidir si el admin adopta la nueva marca o se mantiene el tema dorado oscuro.
- [ ] Reemplazar colores hex literales en badges, KPIs y gráficos por tokens semánticos (`success`, `error`, `warning`, `info`).
- [ ] Revisar `admin-sidebar`, `admin-header`, login.
- [ ] Revisar credenciales y autenticación mock.

### 12.6 Datos y contenido

- [ ] Actualizar `siteConfig` en `src/lib/seo.ts` si cambian nombre, tagline, URL, contacto.
- [ ] Centralizar teléfono, email, direcciones, WhatsApp, redes sociales en una sola fuente (`siteConfig` o `configuración`).
- [ ] Actualizar `src/lib/mocks.ts` con nuevos datos de contacto, productos, precios, FAQ.
- [ ] Revisar `src/data/events.ts` — obtener autorizaciones legales o eliminar nombres de terceros.
- [ ] Actualizar SEO keywords y descripciones.
- [ ] Normalizar dominio en `sitemap.ts` y `robots.ts` (`.com` vs. `.com.co`).
- [ ] Actualizar metadata de `layout.tsx` si cambian geo tags o favicon.

### 12.7 Assets visuales

- [ ] Obtener 8 fotos reales de productos.
- [ ] Obtener foto/video real de hero.
- [ ] Obtener 50 fotos de eventos para galería.
- [ ] Obtener fotos de equipo para quienes-somos.
- [ ] Generar OG image con nueva marca.
- [ ] Generar iconos/favicon con nueva marca.
- [ ] Eliminar o archivar `scripts/generate-placeholders.py` si ya no se necesita.

### 12.8 Accesibilidad y calidad

- [ ] Verificar contrastes en todos los estados.
- [ ] Revisar `focus-visible` con nuevos colores.
- [ ] Mantener `prefers-reduced-motion`.
- [ ] Verificar que el menú móvil y dropdown sigan siendo usables.
- [ ] Ejecutar `npm run build` y `npm run lint` después de cada fase.
- [ ] Revisar CSP en `next.config.ts` si se añaden nuevos dominios de assets o CDNs.

---

## 13. Recomendaciones estratégicas para el rebrand

1. **Centralizar la fuente de verdad.** Expandir `src/lib/seo.ts` o crear `src/lib/site.ts` para que todos los componentes lean dominio, contacto, redes, año de copyright, etc. desde un solo lugar. Esto elimina la duplicación actual de ~15 archivos.
2. **Tratar el admin como un tema separado.** El admin actual funciona con una paleta dorado-oscuro. Si el rebrand público es muy distinto, se recomienda mantener el admin theme separado o crear un segundo set de tokens.
3. **No migrar la galería hasta tener fotos reales.** Los placeholders perpetuarán la percepción de prototipo. Priorizar la producción/curaduría de fotos de eventos reales.
4. **Auditoría legal previa.** Resolver autorizaciones de eventos y eliminar testimonios ficticios antes de publicar.
5. **Parametrizar el logo.** Convertir `src/components/logo.tsx` en un SVG que use CSS variables o props para colores, de modo que un cambio de marca no requiera editar paths manualmente.
6. **Actualizar o eliminar `/design-system`.** La página actual es más confusa que útil. Recomendación: regenerarla automáticamente desde los tokens reales o quitarla.
7. **Definir un sistema de color semántico para estados.** Migrar los hex literales del admin (`#22C55E`, `#EF4444`, etc.) a tokens `success`, `error`, `warning`, `info` que se mapeen a la nueva paleta.
8. **Documentar el nuevo sistema.** Una vez definida la nueva identidad, crear un `design-tokens.md` actualizado y mantener este documento maestro vivo.
9. **Plan de despliegue por fases.** Dado el alto acoplamiento visual, se recomienda: (1) tokens, (2) logo/favicon/OG, (3) layout + home, (4) páginas públicas, (5) admin, (6) assets reales, (7) validación final.
10. **Mantener funcionalidad.** El rebrand debe cambiar estilos y contenido, no romper formularios, autenticación, cotizador, panel admin ni SEO.

---

## 14. Apéndice: Archivos más sensibles al rebrand

Ordenados por impacto descendente:

1. `src/app/globals.css` — fuente de tokens.
2. `src/components/logo.tsx` — marca inline.
3. `src/components/layout/navbar.tsx` — navegación y primer impacto visual.
4. `src/components/layout/footer.tsx` — footer oscuro con datos de contacto.
5. `src/components/home/hero.tsx` — hero principal.
6. `src/components/product-card.tsx` — cards de producto.
7. `src/app/design-system/page.tsx` — referencia visual desactualizada.
8. `src/components/our-numbers.tsx` — stats con acento dorado.
9. `src/components/home/why-us.tsx` — sección oscura de diferenciadores.
10. `src/components/home/contact.tsx` — sección oscura de contacto.
11. `src/app/quienes-somos/page.tsx` — historia e imagen corporativa.
12. `src/app/galeria/gallery-grid.tsx` — colores de tipo de evento.
13. `src/app/servicios/page.tsx` — iconos y cards de servicios.
14. `src/components/admin/status-badge.tsx`, `kpi-card.tsx`, `cotizaciones-status-chart.tsx` — colores hex admin.
15. `src/lib/seo.ts` — metadatos y datos de marca.
16. `src/lib/mocks.ts` — contenido corporativo completo.
17. `src/data/events.ts` — eventos y marcas de terceros.

---

*Fin del documento maestro.*
