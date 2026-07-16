import type { Metadata } from "next"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: "Design System",
  robots: {
    index: false,
    follow: false,
  },
}

const colors = [
  { name: 'primary', bg: 'bg-primary', text: 'text-primary-foreground', hex: '#FF6B35' },
  { name: 'primary-hover', bg: 'bg-primary-hover', text: 'text-white', hex: '#E55A2B' },
  { name: 'primary-light', bg: 'bg-primary-light', text: 'text-dark', hex: '#FFF0EB' },
  { name: 'secondary', bg: 'bg-secondary', text: 'text-secondary-foreground', hex: '#1A202C' },
  { name: 'secondary-elevated', bg: 'bg-secondary-elevated', text: 'text-white', hex: '#2D3748' },
  { name: 'accent-gold', bg: 'bg-accent-gold', text: 'text-white', hex: '#D4A853' },
  { name: 'dark', bg: 'bg-dark', text: 'text-white', hex: '#111111' },
  { name: 'body', bg: 'bg-body', text: 'text-white', hex: '#4A5568' },
  { name: 'muted', bg: 'bg-muted', text: 'text-white', hex: '#718096' },
  { name: 'bg-light', bg: 'bg-bg-light', text: 'text-dark', hex: '#F7FAFC' },
  { name: 'bg-warm', bg: 'bg-bg-warm', text: 'text-dark', hex: '#FAF9F7' },
  { name: 'border', bg: 'bg-border', text: 'text-dark', hex: '#E2E8F0' },
  { name: 'success', bg: 'bg-success', text: 'text-white', hex: '#10B981' },
  { name: 'error', bg: 'bg-error', text: 'text-white', hex: '#EF4444' },
  { name: 'warning', bg: 'bg-warning', text: 'text-white', hex: '#F59E0B' },
  { name: 'whatsapp', bg: 'bg-whatsapp', text: 'text-white', hex: '#25D366' },
]

const typography = [
  { name: '6xl', class: 'text-6xl', sample: 'Hero grande' },
  { name: '5xl', class: 'text-5xl', sample: 'Hero desktop' },
  { name: '4xl', class: 'text-4xl', sample: 'Título H2' },
  { name: '3xl', class: 'text-3xl', sample: 'Título H3' },
  { name: '2xl', class: 'text-2xl', sample: 'Título H4' },
  { name: 'xl', class: 'text-xl', sample: 'Título card' },
  { name: 'lg', class: 'text-lg', sample: 'Subtítulo' },
  { name: 'base', class: 'text-base', sample: 'Texto base lorem ipsum dolor sit amet.' },
  { name: 'sm', class: 'text-sm', sample: 'Texto secundario' },
  { name: 'xs', class: 'text-xs', sample: 'Badge / label' },
]

const shadows = [
  { name: 'shadow-sm', class: 'shadow-sm' },
  { name: 'shadow-md', class: 'shadow-md' },
  { name: 'shadow-lg', class: 'shadow-lg' },
  { name: 'shadow-xl', class: 'shadow-xl' },
  { name: 'shadow-focus', class: 'shadow-focus' },
]

const radii = [
  { name: 'rounded-sm', class: 'rounded-sm' },
  { name: 'rounded-md', class: 'rounded-md' },
  { name: 'rounded-lg', class: 'rounded-lg' },
  { name: 'rounded-xl', class: 'rounded-xl' },
  { name: 'rounded-full', class: 'rounded-full' },
]

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-secondary py-16">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-accent-gold text-white hover:bg-accent-gold">Design System</Badge>
          <h1 className="text-5xl font-extrabold text-white md:text-6xl">
            Sistema de diseño Junisama
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-on-dark-muted">
            Fundamento visual para la web corporativa y el panel administrativo.
            Industrial, confiable, premium y ambientalmente consciente.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {/* Colores */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Paleta de colores</h2>
          <p className="mb-8 text-body">Naranja industrial como acento, azul marino para estructura y dorado para señales de confianza.</p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {colors.map((color) => (
              <article key={color.name} className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                <div className={`h-24 w-full ${color.bg} ${color.text} flex items-center justify-center text-sm font-semibold`}>
                  {color.hex}
                </div>
                <div className="p-3">
                  <p className="font-semibold text-dark">{color.name}</p>
                  <p className="text-xs text-muted">{color.hex}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Tipografía */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Tipografía</h2>
          <p className="mb-8 text-body">Familia Inter, pesos 400 a 800. Escala optimizada para legibilidad en eventos y administración.</p>
          <div className="space-y-6 rounded-lg border border-border bg-white p-6 shadow-sm">
            {typography.map((t) => (
              <div key={t.name} className="flex flex-col gap-1 border-b border-border-subtle pb-4 last:border-0 last:pb-0">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">{t.class}</span>
                <span className={`${t.class} text-dark`}>{t.sample}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Botones */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Botones</h2>
          <p className="mb-8 text-body">CTAs con naranja Junisama, estados claros y foco accesible.</p>
          <div className="space-y-8 rounded-lg border border-border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <Button>Primario</Button>
              <Button variant="secondary">Secundario</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructivo</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button disabled>Deshabilitado</Button>
              <Button variant="outline" disabled>Outline disabled</Button>
            </div>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Inputs */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Formularios</h2>
          <p className="mb-8 text-body">Inputs con bordes sutiles, radio coherente y estados de foco naranja.</p>
          <div className="grid gap-6 rounded-lg border border-border bg-white p-6 shadow-sm md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input id="name" placeholder="Ej: Carlos Pérez" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="correo@ejemplo.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled">Deshabilitado</Label>
              <Input id="disabled" disabled placeholder="No editable" />
            </div>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Cards */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Tarjetas</h2>
          <p className="mb-8 text-body">Superficies con sombra controlada, bordes sutiles y jerarquía clara.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Baño VIP</CardTitle>
                <CardDescription>Unidad premium para eventos de alto nivel.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-body">Incluye espejo, iluminación LED y acabados de lujo.</p>
                <Button className="mt-4 w-full">Cotizar</Button>
              </CardContent>
            </Card>

            <Card className="bg-secondary text-white">
              <CardHeader>
                <CardTitle className="text-white">Estadísticas</CardTitle>
                <CardDescription className="text-text-on-dark-muted">Resumen mensual</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white">128</p>
                <p className="text-sm text-text-on-dark-muted">eventos atendidos</p>
              </CardContent>
            </Card>

            <Card className="border-accent-gold bg-accent-gold-bg">
              <CardHeader>
                <CardTitle className="text-dark">Certificación</CardTitle>
                <CardDescription>ISO 14001</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-body">Compromiso con la gestión ambiental responsable.</p>
                <Badge className="mt-4 bg-accent-gold text-white hover:bg-accent-gold">Verificado</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Badges */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Badges</h2>
          <p className="mb-8 text-body">Etiquetas de estado y categoría con uso cromático disciplinado.</p>
          <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-white p-6 shadow-sm">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secundario</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge className="bg-primary text-primary-foreground hover:bg-primary-hover">Naranja</Badge>
            <Badge className="bg-accent-gold text-white hover:bg-accent-gold">Dorado</Badge>
            <Badge className="bg-success text-white hover:bg-success">Éxito</Badge>
            <Badge className="bg-warning text-white hover:bg-warning">Advertencia</Badge>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Sombras */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Sombras</h2>
          <p className="mb-8 text-body">Elevación progresiva sin saturar la interfaz.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shadows.map((s) => (
              <article key={s.name} className={`rounded-lg bg-white p-6 ${s.class}`}>
                <p className="font-semibold text-dark">{s.name}</p>
              </article>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Radios */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Radios de borde</h2>
          <p className="mb-8 text-body">Escala coherente desde inputs hasta feature cards.</p>
          <div className="flex flex-wrap items-center gap-6 rounded-lg border border-border bg-white p-6 shadow-sm">
            {radii.map((r) => (
              <article key={r.name} className={`flex h-20 w-20 items-center justify-center border border-border bg-bg-light ${r.class}`}>
                <span className="text-xs text-muted">{r.name}</span>
              </article>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Espaciado */}
        <section className="mb-20">
          <h2 className="mb-2 text-3xl font-bold text-dark">Espaciado (sistema 8px)</h2>
          <p className="mb-8 text-body">Escala: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.</p>
          <div className="space-y-3 rounded-lg border border-border bg-white p-6 shadow-sm">
            {[4, 8, 12, 16, 24, 32, 48, 64, 96, 128].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <span className="w-16 text-sm text-muted">{size}px</span>
                <div className="h-4 bg-primary" style={{ width: `${size}px` }} />
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Modo oscuro */}
        <section className="mb-12">
          <h2 className="mb-2 text-3xl font-bold text-dark">Modo oscuro</h2>
          <p className="mb-8 text-body">La paleta se adapta manteniendo contraste y jerarquía.</p>
          <div className="rounded-lg bg-secondary p-8">
            <h3 className="text-2xl font-bold text-white">Sección oscura</h3>
            <p className="mt-2 text-text-on-dark-muted">
              Texto secundario en tono gris azulado para lectura cómoda sobre fondo oscuro.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button>CTA naranja</Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">Outline oscuro</Button>
              <Badge className="bg-accent-gold text-white hover:bg-accent-gold">Premium</Badge>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t bg-bg-light py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted">
          © {new Date().getFullYear()} Junisama Inversiones S.A.S — Design System v1.0
        </div>
      </footer>
    </main>
  )
}
