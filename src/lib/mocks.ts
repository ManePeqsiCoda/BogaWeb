// Datos mock para el prototipo de BOGA
// Reemplazan temporalmente el backend y la base de datos

import { siteConfig } from "@/lib/site"

export type EstadoProducto = "ACTIVO" | "INACTIVO" | "AGOTADO"
export type TipoProducto = "PRODUCTO" | "SERVICIO"
export type FuenteCliente = "WEB" | "REFERIDO" | "WHATSAPP" | "TELEFONO"
export type EstadoCliente = "PROSPECTO" | "ACTIVO" | "INACTIVO"
export type EstadoCotizacion = "BORRADOR" | "ENVIADA" | "APROBADA" | "RECHAZADA" | "EXPIRADA"
export type TipoEvento = "CONCIERTO" | "FERIA" | "FESTIVAL" | "CORPORATIVO" | "GOBIERNO" | "PRIVADO"
export type RolUsuario = "ADMIN" | "EDITOR"
export type CategoriaFaq = "GENERAL" | "PRODUCTOS" | "SERVICIOS" | "PRECIOS" | "EVENTOS"
export type EstadoFaq = "PUBLICADO" | "BORRADOR"

export interface Categoria {
  id: string
  slug: string
  nombre: string
  descripcion?: string | null
  icono?: string | null
  orden: number
}

export interface Producto {
  id: string
  slug: string
  nombre: string
  nombreCorto: string
  descripcion: string
  descripcionCorta: string
  categoriaId: string
  categoria: Categoria
  tipo: TipoProducto
  badge?: string | null
  imagenPrincipal: string
  imagenes?: unknown
  especificaciones?: unknown
  precioBase: number | null
  unidadMedida: string
  destacado: boolean
  orden: number
  seoTitle?: string | null
  seoDescription?: string | null
  estado: EstadoProducto
}

export interface Cliente {
  id: string
  nombreEmpresa: string
  nombreContacto?: string | null
  email: string
  telefono: string
  sector?: string | null
  ciudad?: string | null
  direccion?: string | null
  notas?: string | null
  fuente: FuenteCliente
  estado: EstadoCliente
  cotizaciones?: Cotizacion[]
}

export interface CotizacionItem {
  id: string
  cotizacionId: string
  productoId: string
  producto: Producto
  cantidad: number
  precioUnitario: number
  precioTotal: number
  descripcionPersonalizada?: string | null
  costoUnitario?: number | null
}

export interface Cotizacion {
  id: string
  codigo: string
  clienteId: string
  cliente: Cliente
  nombre: string
  descripcion?: string | null
  estado: EstadoCotizacion
  fechaEvento?: string | null
  ubicacionEvento?: string | null
  tipoEvento?: string | null
  duracionDias?: number | null
  costoTotal?: number | null
  precioVenta?: number | null
  margen?: number | null
  moneda: string
  items: CotizacionItem[]
  creadoPorId: string
  notasInternas?: string | null
  createdAt: string
  updatedAt: string
}

export interface Evento {
  id: string
  slug: string
  nombre: string
  anio: number
  tipo?: TipoEvento | null
  descripcion?: string | null
  imagenPrincipal?: string | null
  ciudad?: string | null
  cantidadUnidades?: number | null
  productosUsados?: string[]
  testimonio?: string | null
  nombreTestimonio?: string | null
  cargoTestimonio?: string | null
  estrellasTestimonio?: number | null
  destacado: boolean
  estado: string
}

export interface Usuario {
  id: string
  email: string
  nombre: string
  passwordHash: string
  rol: RolUsuario
  activo: boolean
}

export interface Configuracion {
  id: number
  nombreSitio: string
  telefono: string | null
  email: string | null
  direccionMedellin: string | null
  direccionBogota: string | null
  whatsappNumero: string | null
  instagramUrl?: string | null
  linkedinUrl?: string | null
  seoTitleDefault?: string | null
  seoDescriptionDefault?: string | null
  scriptAnalytics?: string | null
  mensajeWhatsApp: string | null
}

export interface Faq {
  id: string
  pregunta: string
  respuesta: string
  categoria: CategoriaFaq
  orden: number
  estado: EstadoFaq
}

// Categorías
export const categorias: Categoria[] = [
  {
    id: "cat_1",
    slug: "banos-portatiles",
    nombre: "Baños portátiles",
    descripcion: "Soluciones sanitarias para eventos y obras",
    icono: "Bath",
    orden: 1,
  },
  {
    id: "cat_2",
    slug: "lavamanos",
    nombre: "Lavamanos",
    descripcion: "Estaciones de higiene portátiles",
    icono: "Droplets",
    orden: 2,
  },
  {
    id: "cat_3",
    slug: "puntos-ecologicos",
    nombre: "Puntos ecológicos",
    descripcion: "Manejo responsable de residuos",
    icono: "Leaf",
    orden: 3,
  },
  {
    id: "cat_4",
    slug: "servicios",
    nombre: "Servicios",
    descripcion: "Operarios y logística",
    icono: "Users",
    orden: 4,
  },
]

// Productos
export const productos: Producto[] = [
  {
    id: "prod_1",
    slug: "bano-vip",
    nombre: "Baño Portátil VIP",
    nombreCorto: "VIP",
    descripcion:
      "Unidad premium con acabados de lujo, espejo iluminado, lavamanos interno, dispensador de jabón y toallas. Ideal para eventos corporativos, bodas y recepciones de alto nivel.",
    descripcionCorta:
      "Baño premium con acabados de lujo, pensado para eventos exclusivos y de alto protocolo.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Premium",
    imagenPrincipal: "/images/products/bano-vip-photo.jpg",
    precioBase: 450000,
    unidadMedida: "unidad",
    destacado: true,
    orden: 1,
    estado: "ACTIVO",
    especificaciones: {
      Medidas: "2.4 × 1.8 × 2.3 m",
      "Tanque de agua": "250 litros",
      Capacidad: "Hasta 200 usos por servicio",
      Incluye: "Lavamanos, ventilación e iluminación LED",
    },
  },
  {
    id: "prod_2",
    slug: "bano-estandar",
    nombre: "Baño Portátil Estándar",
    nombreCorto: "Estándar",
    descripcion:
      "Solución práctica y confiable para obras, festivales y eventos masivos. Resistente, fácil de transportar y de mantenimiento sencillo.",
    descripcionCorta:
      "Baño resistente y práctico para obras, festivales y eventos de alto flujo.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Más popular",
    imagenPrincipal: "/images/products/bano-estandar-photo.jpg",
    precioBase: 180000,
    unidadMedida: "unidad",
    destacado: true,
    orden: 2,
    estado: "ACTIVO",
    especificaciones: {
      Medidas: "1.2 × 1.2 × 2.3 m",
      Capacidad: "Hasta 150 usos por servicio",
      Uso: "Obras, ferias y eventos masivos",
      Incluye: "Ventilación natural y estructura reforzada",
    },
  },
  {
    id: "prod_3",
    slug: "discapacitados",
    nombre: "Baño para Discapacitados",
    nombreCorto: "PMR",
    descripcion:
      "Unidad accesible con rampa, barra de apoyo, espacio amplio para silla de ruedas y señalización inclusiva. Cumple con normas de accesibilidad.",
    descripcionCorta:
      "Baño accesible con rampa y espacio amplio para silla de ruedas.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Inclusivo",
    imagenPrincipal: "/images/products/discapacitados-photo.jpg",
    precioBase: 320000,
    unidadMedida: "unidad",
    destacado: false,
    orden: 3,
    estado: "ACTIVO",
    especificaciones: {
      Medidas: "2.2 × 2.0 × 2.3 m",
      Acceso: "Rampa incluida",
      Interior: "Espacio para silla de ruedas",
      Seguridad: "Barras de apoyo en acero",
    },
  },
  {
    id: "prod_4",
    slug: "electricos",
    nombre: "Baños Eléctricos",
    nombreCorto: "Eléctrico",
    descripcion:
      "Equipos con ventilación forzada, iluminación interior LED y funcionamiento autónomo. Perfectos para eventos nocturnos y ubicaciones sin servicios.",
    descripcionCorta:
      "Baño con extractor e iluminación LED, ideal para eventos nocturnos.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Tecnología",
    imagenPrincipal: "/images/products/electricos-photo.jpg",
    precioBase: 280000,
    unidadMedida: "unidad",
    destacado: false,
    orden: 4,
    estado: "ACTIVO",
    especificaciones: {
      Medidas: "1.4 × 1.4 × 2.3 m",
      Ventilación: "Extractor eléctrico continuo",
      Iluminación: "LED interior integrado",
      Autonomía: "Hasta 8 horas con batería",
    },
  },
  {
    id: "prod_5",
    slug: "lavamanos",
    nombre: "Lavamanos Portátil",
    nombreCorto: "Lavamanos",
    descripcion:
      "Estación de higiene portátil con doble puesto, dispensador de jabón, toallas desechables y tanque de agua limpia/residual separados.",
    descripcionCorta:
      "Estación de lavado de manos con dos puestos y jabón incluido.",
    categoriaId: "cat_2",
    categoria: categorias[1],
    tipo: "PRODUCTO",
    imagenPrincipal: "/images/products/lavamanos-photo.jpg",
    precioBase: 150000,
    unidadMedida: "unidad",
    destacado: false,
    orden: 5,
    estado: "ACTIVO",
    especificaciones: {
      Puestos: "2 personas al mismo tiempo",
      "Agua limpia": "Tanque de 80 litros",
      "Agua residual": "Tanque de 90 litros",
      Incluye: "Jabón y toallas desechables",
    },
  },
  {
    id: "prod_6",
    slug: "trailer-lujo",
    nombre: "Trailer de Lujo",
    nombreCorto: "Trailer",
    descripcion:
      "Múltiples cabinas climatizadas con distribución optimizada para grandes eventos. Incluye espejos, iluminación ambiental y área de lavamanos.",
    descripcionCorta:
      "Trailer con varias cabinas climatizadas para eventos de gran formato.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Alto volumen",
    imagenPrincipal: "/images/products/trailer-lujo-photo.jpg",
    precioBase: 2500000,
    unidadMedida: "unidad",
    destacado: true,
    orden: 6,
    estado: "ACTIVO",
    especificaciones: {
      Medidas: "9 × 2.5 × 2.9 m",
      Cabinas: "6 cabinas privadas",
      Capacidad: "Hasta 1.500 usos por servicio",
      Confort: "Aire acondicionado e iluminación",
    },
  },
  {
    id: "prod_7",
    slug: "operarios",
    nombre: "Servicio de Operarios",
    nombreCorto: "Operarios",
    descripcion:
      "Personal capacitado para limpieza, desinfección, abastecimiento y mantenimiento durante todo el evento. Garantiza una experiencia impecable.",
    descripcionCorta:
      "Personal en sitio para limpieza, reposición y soporte durante el evento.",
    categoriaId: "cat_4",
    categoria: categorias[3],
    tipo: "SERVICIO",
    imagenPrincipal: "/images/products/operarios-photo.jpg",
    precioBase: 180000,
    unidadMedida: "turno",
    destacado: false,
    orden: 7,
    estado: "ACTIVO",
    especificaciones: {
      Jornada: "Turnos de 8 horas",
      Cobertura: "1 operario por cada 10 unidades",
      Incluye: "Limpieza, desinfección y reposición",
      Supervisión: "Acompañamiento técnico en sitio",
    },
  },
  {
    id: "prod_8",
    slug: "puntos-ecologicos",
    nombre: "Puntos Ecológicos",
    nombreCorto: "Ecológico",
    descripcion:
      "Estaciones de reciclaje y disposición responsable de residuos para eventos sostenibles. Personalizables con marca del evento.",
    descripcionCorta:
      "Estaciones de reciclaje para separar residuos en eventos sostenibles.",
    categoriaId: "cat_3",
    categoria: categorias[2],
    tipo: "PRODUCTO",
    badge: "Sostenible",
    imagenPrincipal: "/images/products/puntos-ecologicos-photo.jpg",
    precioBase: 220000,
    unidadMedida: "unidad",
    destacado: false,
    orden: 8,
    estado: "ACTIVO",
    especificaciones: {
      Capacidad: "240 litros por estación",
      Separación: "3 tipos de residuos",
      Material: "Estructura reciclable",
      Personalización: "Vinilo con marca del evento",
    },
  },
]

// Clientes
export const clientes: Cliente[] = [
  {
    id: "cli_1",
    nombreEmpresa: "Festival Vallenato SAS",
    nombreContacto: "Carlos Vargas",
    email: "carlos@festivalvallenato.com",
    telefono: "+57 300 123 4567",
    sector: "Entretenimiento",
    ciudad: "Valledupar",
    direccion: "Calle 10 # 5-45",
    notas: "Cliente recurrente para festivales. Paga a 30 días.",
    fuente: "REFERIDO",
    estado: "ACTIVO",
  },
  {
    id: "cli_2",
    nombreEmpresa: "Constructora Horizonte",
    nombreContacto: "María Elena Ríos",
    email: "maria.rios@horizonte.com",
    telefono: "+57 311 987 6543",
    sector: "Construcción",
    ciudad: "Bogotá",
    direccion: "Cra 15 # 85-20",
    notas: "Obra de 18 meses. Requiere servicio mensual.",
    fuente: "WEB",
    estado: "ACTIVO",
  },
  {
    id: "cli_3",
    nombreEmpresa: "Alcaldía de Medellín",
    nombreContacto: "Andrés Posada",
    email: "aposada@medellin.gov.co",
    telefono: "+57 604 123 4567",
    sector: "Gobierno",
    ciudad: "Medellín",
    direccion: "Plaza Mayor",
    notas: "Contratación por licitación. Documentación al día.",
    fuente: "WHATSAPP",
    estado: "ACTIVO",
  },
  {
    id: "cli_4",
    nombreEmpresa: "Eventos Premium Medellín",
    nombreContacto: "Laura Gómez",
    email: "laura@eventospremium.com",
    telefono: "+57 320 555 7890",
    sector: "Corporativo",
    ciudad: "Medellín",
    direccion: "El Poblado",
    notas: "Prospecto interesado en paquete VIP para bodas.",
    fuente: "REFERIDO",
    estado: "PROSPECTO",
  },
  {
    id: "cli_5",
    nombreEmpresa: "Corpomedios",
    nombreContacto: "Diego Salazar",
    email: "diego@corpomedios.tv",
    telefono: "+57 315 444 3322",
    sector: "Entretenimiento",
    ciudad: "Bogotá",
    notas: "Eventos de TV. Requieren respuesta inmediata.",
    fuente: "TELEFONO",
    estado: "ACTIVO",
  },
]

// Eventos
export const eventos: Evento[] = [
  {
    id: "evt_1",
    slug: "festival-vallenato-2025",
    nombre: "Festival Vallenato 2025",
    anio: 2025,
    tipo: "FESTIVAL",
    descripcion:
      "Dotación de 80 unidades sanitarias VIP y estándar para el festival más importante de Colombia.",
    imagenPrincipal: "/images/eventos/core-2025.jpg",
    ciudad: "Valledupar",
    cantidadUnidades: 80,
    productosUsados: ["prod_1", "prod_2", "prod_5", "prod_7"],
    destacado: true,
    estado: "PUBLICADO",
  },
  {
    id: "evt_2",
    slug: "feria-internacional-bogota",
    nombre: "Feria Internacional de Bogotá",
    anio: 2024,
    tipo: "FERIA",
    descripcion:
      "Infraestructura sanitaria completa para 15 días de feria con más de 200.000 visitantes.",
    imagenPrincipal: "/images/eventos/feria-manizales-2025.jpg",
    ciudad: "Bogotá",
    cantidadUnidades: 120,
    productosUsados: ["prod_2", "prod_5", "prod_8"],
    destacado: true,
    estado: "PUBLICADO",
  },
  {
    id: "evt_3",
    slug: "concierto-estadio-medellin",
    nombre: "Concierto Estadio Medellín",
    anio: 2024,
    tipo: "CONCIERTO",
    descripcion:
      "Atención a 35.000 asistentes con unidades estándar y eléctricas para concierto nocturno.",
    imagenPrincipal: "/images/eventos/rancheton-2024.jpg",
    ciudad: "Medellín",
    cantidadUnidades: 90,
    productosUsados: ["prod_2", "prod_4", "prod_5"],
    destacado: false,
    estado: "PUBLICADO",
  },
  {
    id: "evt_4",
    slug: "obra-vial-antioquia",
    nombre: "Obra Vial Antioquia",
    anio: 2025,
    tipo: "CORPORATIVO",
    descripcion:
      "Servicio mensual de baños estándar y puntos ecológicos para obra de infraestructura vial.",
    imagenPrincipal: "/images/eventos/papa-francisco-2017.jpg",
    ciudad: "Antioquia",
    cantidadUnidades: 24,
    productosUsados: ["prod_2", "prod_8"],
    destacado: false,
    estado: "PUBLICADO",
  },
  {
    id: "evt_5",
    slug: "boda-destino-cartagena",
    nombre: "Boda Destino Cartagena",
    anio: 2025,
    tipo: "PRIVADO",
    descripcion:
      "Baños VIP y trailer de lujo para boda exclusiva en la playa con 300 invitados.",
    imagenPrincipal: "/images/eventos/picnic-andres-2019.jpg",
    ciudad: "Cartagena",
    cantidadUnidades: 12,
    productosUsados: ["prod_1", "prod_6"],
    destacado: true,
    estado: "PUBLICADO",
  },
]

// Usuarios
export const usuarios: Usuario[] = [
  {
    id: "usr_1",
    email: siteConfig.admin.email,
    nombre: "Administrador BOGA",
    passwordHash: "mock-hash",
    rol: "ADMIN",
    activo: true,
  },
]

// Cotizaciones
export const cotizaciones: Cotizacion[] = [
  {
    id: "cot_1",
    codigo: "COT-2025-0001",
    clienteId: "cli_1",
    cliente: clientes[0],
    nombre: "Festival Vallenato 2025",
    descripcion: "Cotización para dotación sanitaria del festival.",
    estado: "APROBADA",
    fechaEvento: "2025-04-28",
    ubicacionEvento: "Valledupar, Cesar",
    tipoEvento: "Festival",
    duracionDias: 5,
    costoTotal: 12000000,
    precioVenta: 15800000,
    margen: 24.05,
    moneda: "COP",
    items: [
      {
        id: "item_1",
        cotizacionId: "cot_1",
        productoId: "prod_1",
        producto: productos[0],
        cantidad: 10,
        precioUnitario: 450000,
        precioTotal: 4500000,
        costoUnitario: 320000,
      },
      {
        id: "item_2",
        cotizacionId: "cot_1",
        productoId: "prod_2",
        producto: productos[1],
        cantidad: 50,
        precioUnitario: 180000,
        precioTotal: 9000000,
        costoUnitario: 130000,
      },
      {
        id: "item_3",
        cotizacionId: "cot_1",
        productoId: "prod_7",
        producto: productos[6],
        cantidad: 6,
        precioUnitario: 180000,
        precioTotal: 1080000,
      },
    ],
    creadoPorId: "usr_1",
    notasInternas: "Cliente aprobó por email. Facturar a 30 días.",
    createdAt: "2025-02-10T10:00:00.000Z",
    updatedAt: "2025-02-12T14:30:00.000Z",
  },
  {
    id: "cot_2",
    codigo: "COT-2025-0002",
    clienteId: "cli_2",
    cliente: clientes[1],
    nombre: "Obra Constructora Horizonte",
    descripcion: "Servicio mensual de baños estándar.",
    estado: "ENVIADA",
    fechaEvento: "2025-03-01",
    ubicacionEvento: "Bogotá",
    tipoEvento: "Obra",
    duracionDias: 30,
    costoTotal: 5400000,
    precioVenta: 7200000,
    margen: 25,
    moneda: "COP",
    items: [
      {
        id: "item_4",
        cotizacionId: "cot_2",
        productoId: "prod_2",
        producto: productos[1],
        cantidad: 20,
        precioUnitario: 180000,
        precioTotal: 3600000,
        costoUnitario: 130000,
      },
      {
        id: "item_5",
        cotizacionId: "cot_2",
        productoId: "prod_7",
        producto: productos[6],
        cantidad: 2,
        precioUnitario: 180000,
        precioTotal: 360000,
      },
    ],
    creadoPorId: "usr_1",
    createdAt: "2025-02-15T09:00:00.000Z",
    updatedAt: "2025-02-15T09:00:00.000Z",
  },
  {
    id: "cot_3",
    codigo: "COT-2025-0003",
    clienteId: "cli_3",
    cliente: clientes[2],
    nombre: "Evento Alcaldía de Medellín",
    descripcion: "Cotización para evento institucional.",
    estado: "BORRADOR",
    fechaEvento: "2025-05-20",
    ubicacionEvento: "Medellín",
    tipoEvento: "Corporativo",
    costoTotal: 3500000,
    precioVenta: 4500000,
    margen: 22.22,
    moneda: "COP",
    items: [
      {
        id: "item_6",
        cotizacionId: "cot_3",
        productoId: "prod_1",
        producto: productos[0],
        cantidad: 5,
        precioUnitario: 450000,
        precioTotal: 2250000,
        costoUnitario: 320000,
      },
      {
        id: "item_7",
        cotizacionId: "cot_3",
        productoId: "prod_5",
        producto: productos[4],
        cantidad: 8,
        precioUnitario: 150000,
        precioTotal: 1200000,
      },
    ],
    creadoPorId: "usr_1",
    createdAt: "2025-02-18T16:00:00.000Z",
    updatedAt: "2025-02-18T16:00:00.000Z",
  },
]

// FAQs
export const faqs: Faq[] = [
  {
    id: "faq_1",
    pregunta: "¿Cuántos baños necesito para mi evento?",
    respuesta:
      "Recomendamos 1 baño por cada 75-100 personas para eventos de hasta 4 horas. Para eventos más largos o con consumo de alcohol, sugerimos 1 por cada 50-75 personas. Nuestro equipo te asesora según el tipo de evento.",
    categoria: "GENERAL",
    orden: 1,
    estado: "PUBLICADO",
  },
  {
    id: "faq_2",
    pregunta: "¿Incluyen servicio de limpieza durante el evento?",
    respuesta:
      "Sí, ofrecemos servicio de operarios capacitados para limpieza, desinfección y abastecimiento durante todo el evento. Se recomienda 1 operario por cada 10 unidades.",
    categoria: "SERVICIOS",
    orden: 2,
    estado: "PUBLICADO",
  },
  {
    id: "faq_3",
    pregunta: "¿Cuál es el tiempo mínimo de alquiler?",
    respuesta:
      "El tiempo mínimo de alquiler es de 1 día para eventos y 1 mes para obras de construcción. Podemos ajustarnos a tus necesidades específicas.",
    categoria: "PRECIOS",
    orden: 3,
    estado: "PUBLICADO",
  },
  {
    id: "faq_4",
    pregunta: "¿Tienen unidades accesibles para personas en silla de ruedas?",
    respuesta:
      "Sí, contamos con unidades PMR (Personas con Movilidad Reducida) que incluyen rampa, barra de apoyo y espacio amplio para silla de ruedas.",
    categoria: "PRODUCTOS",
    orden: 4,
    estado: "PUBLICADO",
  },
  {
    id: "faq_5",
    pregunta: "¿Cómo solicito una cotización?",
    respuesta:
      "Puedes solicitar una cotización a través del formulario en nuestra web, por WhatsApp o llamando a nuestra línea de atención. Te responderemos en menos de 24 horas.",
    categoria: "GENERAL",
    orden: 5,
    estado: "PUBLICADO",
  },
  {
    id: "faq_6",
    pregunta: "¿Trabajan en todo Colombia?",
    respuesta:
      "Sí, tenemos cobertura nacional. Nuestras sedes principales están en Medellín y Bogotá, pero realizamos eventos en cualquier ciudad del país.",
    categoria: "GENERAL",
    orden: 6,
    estado: "PUBLICADO",
  },
]

// Configuración
export const configuracion: Configuracion = {
  id: 1,
  nombreSitio: siteConfig.fullName,
  telefono: siteConfig.phone,
  email: siteConfig.email,
  direccionMedellin: siteConfig.addresses[0].street,
  direccionBogota: siteConfig.addresses[1].street,
  whatsappNumero: siteConfig.whatsapp,
  instagramUrl: siteConfig.social.instagram.url,
  linkedinUrl: siteConfig.social.linkedin.url,
  seoTitleDefault: "BOGA | Alquiler de Baños Portátiles en Colombia",
  seoDescriptionDefault:
    "Ingeniería portátil para eventos, obras e industria. Baños VIP, estándar, accesibles y puntos ecológicos en Medellín, Bogotá y toda Colombia.",
  mensajeWhatsApp: siteConfig.whatsappMessage,
}

// Helpers
export function getProductoBySlug(slug: string): Producto | undefined {
  return productos.find((p) => p.slug === slug)
}

export function getProductosDestacados(limit = 4): Producto[] {
  return productos.filter((p) => p.destacado).slice(0, limit)
}

export function getProductosByCategoria(slug: string): Producto[] {
  if (slug === "todos") return productos
  return productos.filter((p) => p.categoria.slug === slug)
}

export function getClienteById(id: string): Cliente | undefined {
  return clientes.find((c) => c.id === id)
}

export function getCotizacionById(id: string): Cotizacion | undefined {
  return cotizaciones.find((c) => c.id === id)
}

export function getEventoById(id: string): Evento | undefined {
  return eventos.find((e) => e.id === id)
}

export function getEventoBySlug(slug: string): Evento | undefined {
  return eventos.find((e) => e.slug === slug)
}

export function getFaqsByCategoria(categoria?: CategoriaFaq): Faq[] {
  const list = faqs.filter((f) => f.estado === "PUBLICADO")
  if (!categoria || categoria === "GENERAL") return list
  return list.filter((f) => f.categoria === categoria)
}

let mockIdCounter = 0

export function generateMockId(prefix: string): string {
  mockIdCounter += 1
  return `${prefix}_${Date.now()}_${mockIdCounter}`
}

export const CURRENT_YEAR = new Date().getFullYear()

export function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

export function parseDateToISO(dateString: string): string {
  return new Date(dateString).toISOString()
}

// Cotizador BOGA (admin) — catálogo con tarifas; no reemplaza `productos` públicos
export {
  CATALOGO_VERSION,
  DEFAULT_CATALOGO,
  PLANTILLAS_PAQUETE,
  COTIZACIONES_DEMO,
  SOLICITUDES_DEMO,
  getCatalogItemBySlug,
  getCatalogItemById,
} from "@/lib/mocks/cotizador-boga"
