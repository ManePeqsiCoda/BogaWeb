// Datos mock para el prototipo de Junisama
// Reemplazan temporalmente el backend y la base de datos

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
    descripcionCorta: "Unidad premium con acabados de lujo para eventos exclusivos.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Premium",
    imagenPrincipal: "/images/products/bano-vip.jpg",
    precioBase: 450000,
    unidadMedida: "unidad",
    destacado: true,
    orden: 1,
    estado: "ACTIVO",
    especificaciones: {
      Dimensiones: "2.4m x 1.8m x 2.3m",
      Capacidad: "200 usos",
      "Tanque de agua": "250L",
      Ventilación: "Forzada",
      Iluminación: "LED",
    },
  },
  {
    id: "prod_2",
    slug: "bano-estandar",
    nombre: "Baño Portátil Estándar",
    nombreCorto: "Estándar",
    descripcion:
      "Solución práctica y confiable para obras, festivales y eventos masivos. Resistente, fácil de transportar y de mantenimiento sencillo.",
    descripcionCorta: "Solución práctica para obras y eventos masivos.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Más popular",
    imagenPrincipal: "/images/products/bano-estandar.jpg",
    precioBase: 180000,
    unidadMedida: "unidad",
    destacado: true,
    orden: 2,
    estado: "ACTIVO",
    especificaciones: {
      Dimensiones: "1.2m x 1.2m x 2.3m",
      Capacidad: "150 usos",
      Material: "Polietileno de alta densidad",
      Ventilación: "Natural",
    },
  },
  {
    id: "prod_3",
    slug: "discapacitados",
    nombre: "Baño para Discapacitados",
    nombreCorto: "PMR",
    descripcion:
      "Unidad accesible con rampa, barra de apoyo, espacio amplio para silla de ruedas y señalización inclusiva. Cumple con normas de accesibilidad.",
    descripcionCorta: "Unidad accesible con rampa y barras de apoyo.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Inclusivo",
    imagenPrincipal: "/images/products/discapacitados.jpg",
    precioBase: 320000,
    unidadMedida: "unidad",
    destacado: false,
    orden: 3,
    estado: "ACTIVO",
    especificaciones: {
      Dimensiones: "2.2m x 2.0m x 2.3m",
      Accesibilidad: "Silla de ruedas",
      Rampas: "Incluidas",
      "Barras de apoyo": "Acero inoxidable",
    },
  },
  {
    id: "prod_4",
    slug: "electricos",
    nombre: "Baños Eléctricos",
    nombreCorto: "Eléctrico",
    descripcion:
      "Equipos con ventilación forzada, iluminación interior LED y funcionamiento autónomo. Perfectos para eventos nocturnos y ubicaciones sin servicios.",
    descripcionCorta: "Ventilación forzada e iluminación LED integrada.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Tecnología",
    imagenPrincipal: "/images/products/electricos.jpg",
    precioBase: 280000,
    unidadMedida: "unidad",
    destacado: false,
    orden: 4,
    estado: "ACTIVO",
    especificaciones: {
      Dimensiones: "1.4m x 1.4m x 2.3m",
      Ventilación: "Forzada con extractor",
      Iluminación: "LED 12V",
      Autonomía: "Batería 8 horas",
    },
  },
  {
    id: "prod_5",
    slug: "lavamanos",
    nombre: "Lavamanos Portátil",
    nombreCorto: "Lavamanos",
    descripcion:
      "Estación de higiene portátil con doble puesto, dispensador de jabón, toallas desechables y tanque de agua limpia/residual separados.",
    descripcionCorta: "Estación de higiene portátil con doble puesto.",
    categoriaId: "cat_2",
    categoria: categorias[1],
    tipo: "PRODUCTO",
    imagenPrincipal: "/images/products/lavamanos.jpg",
    precioBase: 150000,
    unidadMedida: "unidad",
    destacado: false,
    orden: 5,
    estado: "ACTIVO",
    especificaciones: {
      Puestos: "2",
      "Tanque agua limpia": "80L",
      "Tanque agua residual": "90L",
      Dispensador: "Jabón y toallas",
    },
  },
  {
    id: "prod_6",
    slug: "trailer-lujo",
    nombre: "Trailer de Lujo",
    nombreCorto: "Trailer",
    descripcion:
      "Múltiples cabinas climatizadas con distribución optimizada para grandes eventos. Incluye espejos, iluminación ambiental y área de lavamanos.",
    descripcionCorta: "Múltiples cabinas climatizadas para grandes eventos.",
    categoriaId: "cat_1",
    categoria: categorias[0],
    tipo: "PRODUCTO",
    badge: "Alto volumen",
    imagenPrincipal: "/images/products/trailer-lujo.jpg",
    precioBase: 2500000,
    unidadMedida: "unidad",
    destacado: true,
    orden: 6,
    estado: "ACTIVO",
    especificaciones: {
      Dimensiones: "9m x 2.5m x 2.9m",
      Cabinás: "6",
      Capacidad: "1.500 usos",
      Climatización: "Aire acondicionado",
    },
  },
  {
    id: "prod_7",
    slug: "operarios",
    nombre: "Servicio de Operarios",
    nombreCorto: "Operarios",
    descripcion:
      "Personal capacitado para limpieza, desinfección, abastecimiento y mantenimiento durante todo el evento. Garantiza una experiencia impecable.",
    descripcionCorta: "Personal capacitado para limpieza y mantenimiento.",
    categoriaId: "cat_4",
    categoria: categorias[3],
    tipo: "SERVICIO",
    imagenPrincipal: "/images/products/operarios.jpg",
    precioBase: 180000,
    unidadMedida: "turno",
    destacado: false,
    orden: 7,
    estado: "ACTIVO",
    especificaciones: {
      Jornada: "8 horas",
      Personal: "1 operario por 10 unidades",
      Incluye: "Limpieza, desinfección y abastecimiento",
    },
  },
  {
    id: "prod_8",
    slug: "puntos-ecologicos",
    nombre: "Puntos Ecológicos",
    nombreCorto: "Ecológico",
    descripcion:
      "Estaciones de reciclaje y disposición responsable de residuos para eventos sostenibles. Personalizables con marca del evento.",
    descripcionCorta: "Estaciones de reciclaje para eventos sostenibles.",
    categoriaId: "cat_3",
    categoria: categorias[2],
    tipo: "PRODUCTO",
    badge: "Sostenible",
    imagenPrincipal: "/images/products/puntos-ecologicos.jpg",
    precioBase: 220000,
    unidadMedida: "unidad",
    destacado: false,
    orden: 8,
    estado: "ACTIVO",
    especificaciones: {
      Capacidad: "240L",
      Clasificación: "3 residuos",
      Material: "Metal reciclado",
      Personalización: "Vinilo marca evento",
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
    imagenPrincipal: "/images/eventos/placeholder.svg",
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
    imagenPrincipal: "/images/eventos/placeholder.svg",
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
    imagenPrincipal: "/images/eventos/placeholder.svg",
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
    imagenPrincipal: "/images/eventos/placeholder.svg",
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
    imagenPrincipal: "/images/eventos/placeholder.svg",
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
    email: "admin@junisama.com",
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
  nombreSitio: "BOGA — Ingeniería Portátil",
  telefono: "+57 350 708 9584",
  email: "soporte@junisama.com",
  direccionMedellin: "Calle 13 sur #51C-54",
  direccionBogota: "Cra 58b bis #131A 51",
  whatsappNumero: "573507089584",
  instagramUrl: "https://www.instagram.com/junisama_inversiones/",
  linkedinUrl: "https://www.linkedin.com/company/inversiones-junisama-s-a-s/",
  seoTitleDefault: "BOGA | Alquiler de Baños Portátiles en Colombia",
  seoDescriptionDefault:
    "Ingeniería portátil para eventos, obras e industria. Baños VIP, estándar, accesibles y puntos ecológicos en Medellín, Bogotá y toda Colombia.",
  mensajeWhatsApp: "Hola BOGA, me gustaría recibir información sobre sus servicios.",
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
