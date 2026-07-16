import { PrismaClient, TipoProducto, TipoEvento, CategoriaFaq, RolUsuario, FuenteCliente, EstadoCliente } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de Junisama...')

  // ---------- Configuración ----------
  await prisma.configuracion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombreSitio: 'Junisama Inversiones S.A.S',
      telefono: '+57 350 708 9584',
      email: 'soporte@junisama.com',
      direccionMedellin: 'Calle 13 sur #51C-54',
      direccionBogota: 'Cra 58b bis # 131A 51',
      whatsappNumero: '573507089584',
      instagramUrl: 'https://instagram.com/junisama',
      linkedinUrl: 'https://linkedin.com/company/junisama',
      seoTitleDefault: 'Junisama | Alquiler de Baños Portátiles en Colombia',
      seoDescriptionDefault: 'Baños portátiles de lujo, estándar y ecológicos para eventos, obras y emergencias en Medellín, Bogotá y toda Colombia.',
      mensajeWhatsApp: 'Hola, me gustaría recibir información sobre sus servicios.',
    },
  })
  console.log('✅ Configuración creada')

  // ---------- Usuario admin ----------
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@junisama.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Junisama2025!'
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      nombre: 'Administrador Junisama',
      passwordHash,
      rol: RolUsuario.ADMIN,
      activo: true,
    },
  })
  console.log('✅ Usuario admin creado:', adminEmail)

  // ---------- Categorías ----------
  const categoriasData = [
    { slug: 'premium', nombre: 'Premium', descripcion: 'Unidades de lujo para eventos de alto nivel.', icono: 'Crown', orden: 1 },
    { slug: 'estandar', nombre: 'Estándar', descripcion: 'Soluciones prácticas y confiables para cualquier proyecto.', icono: 'Bath', orden: 2 },
    { slug: 'accesibilidad', nombre: 'Accesibilidad', descripcion: 'Baños adaptados para personas con movilidad reducida.', icono: 'Accessibility', orden: 3 },
    { slug: 'ecologico', nombre: 'Ecológico', descripcion: 'Soluciones sostenibles y amigables con el medio ambiente.', icono: 'Leaf', orden: 4 },
    { slug: 'servicios', nombre: 'Servicios', descripcion: 'Operarios, limpieza y acompañamiento logístico.', icono: 'Users', orden: 5 },
  ]

  for (const c of categoriasData) {
    await prisma.categoria.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
  }
  const categorias = await prisma.categoria.findMany()
  const getCatId = (slug: string) => categorias.find((c) => c.slug === slug)?.id || ''
  console.log('✅ Categorías creadas')

  // ---------- Productos ----------
  const productosData = [
    {
      slug: 'bano-vip',
      nombre: 'Baño Portátil VIP',
      nombreCorto: 'VIP',
      descripcion: 'Máximo confort para eventos exclusivos. Unidad premium con acabados de lujo, espejo, iluminación LED, dispensador de jabón y toallas. Ideal para bodas, eventos corporativos y lanzamientos de alto nivel.',
      descripcionCorta: 'Máximo confort para eventos exclusivos.',
      categoriaSlug: 'premium',
      tipo: TipoProducto.PRODUCTO,
      badge: 'SERVICIO PROFESIONAL',
      imagenPrincipal: '/images/productos/placeholder.svg',
      imagenes: ['/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg'],
      especificaciones: {
        altura: '2.12 m',
        peso: '76 kg',
        usos: '220 usos',
        capacidad: '210 L',
        ancho: '1 m',
        material: 'Polietileno',
      },
      precioBase: 280000,
      unidadMedida: 'unidad/día',
      destacado: true,
      orden: 1,
      seoTitle: 'Alquiler de Baños VIP en Colombia',
      seoDescription: 'Baños portátiles VIP con acabados de lujo para eventos corporativos, bodas y lanzamientos en Medellín y Bogotá.',
    },
    {
      slug: 'bano-estandar',
      nombre: 'Baños Portátiles Estándar',
      nombreCorto: 'Estándar',
      descripcion: 'Alta resistencia para cualquier entorno. Unidad confiable y económica para obras, festivales y eventos masivos. Fácil transporte y mantenimiento.',
      descripcionCorta: 'Alta resistencia para cualquier entorno.',
      categoriaSlug: 'estandar',
      tipo: TipoProducto.PRODUCTO,
      badge: 'SERVICIO PROFESIONAL',
      imagenPrincipal: '/images/productos/placeholder.svg',
      imagenes: ['/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg'],
      especificaciones: {
        peso: '83.91 kg',
        capacidad: '227 L',
        ancho: '109.2 cm',
        altura: '220 cm',
      },
      precioBase: 85000,
      unidadMedida: 'unidad/día',
      destacado: true,
      orden: 2,
      seoTitle: 'Alquiler de Baños Portátiles Estándar',
      seoDescription: 'Baños portátiles estándar para obras, festivales y eventos al aire libre en Colombia.',
    },
    {
      slug: 'discapacitados',
      nombre: 'Baños para Discapacitados',
      nombreCorto: 'PMR',
      descripcion: 'Accesibilidad garantizada. Diseñados para personas con movilidad reducida en eventos públicos y privados. Espacio amplio, barra de seguridad y rampa.',
      descripcionCorta: 'Accesibilidad garantizada.',
      categoriaSlug: 'accesibilidad',
      tipo: TipoProducto.PRODUCTO,
      badge: 'SERVICIO PROFESIONAL',
      imagenPrincipal: '/images/productos/placeholder.svg',
      imagenes: ['/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg'],
      especificaciones: {
        altura: '2.2 m',
        peso: '110 kg',
        usos: '150 usos',
        capacidad: '120 L',
        ancho: '1.6 m',
      },
      precioBase: 180000,
      unidadMedida: 'unidad/día',
      destacado: true,
      orden: 3,
      seoTitle: 'Baños Portátiles para Discapacitados',
      seoDescription: 'Unidades accesibles para personas con movilidad reducida. Cumplimiento normativo en eventos y obras.',
    },
    {
      slug: 'electricos',
      nombre: 'Baños Portátiles Eléctricos',
      nombreCorto: 'Eléctrico',
      descripcion: 'Tecnología y confort integrados. Baños con sistema eléctrico para ventilación, iluminación y extracción de olores. Perfectos para eventos nocturnos y lugares cerrados.',
      descripcionCorta: 'Tecnología y confort integrados.',
      categoriaSlug: 'premium',
      tipo: TipoProducto.PRODUCTO,
      badge: 'SERVICIO PROFESIONAL',
      imagenPrincipal: '/images/productos/placeholder.svg',
      imagenes: ['/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg'],
      especificaciones: {
        altura: '2.12 m',
        peso: '104 kg',
        consumo: '1 L/descarga',
        voltaje: '12 V',
        ancho: '1.01 m',
      },
      precioBase: 160000,
      unidadMedida: 'unidad/día',
      destacado: false,
      orden: 4,
      seoTitle: 'Baños Portátiles Eléctricos',
      seoDescription: 'Baños portátiles con sistema eléctrico para ventilación e iluminación en eventos nocturnos.',
    },
    {
      slug: 'lavamanos',
      nombre: 'Lavamanos Portátiles',
      nombreCorto: 'Lavamanos',
      descripcion: 'Higiene de última generación. Estaciones de lavado de manos autónomas con dispensador de jabón y toallas de papel. Indispensables para obras, cocinas y eventos.',
      descripcionCorta: 'Higiene de última generación.',
      categoriaSlug: 'estandar',
      tipo: TipoProducto.PRODUCTO,
      badge: 'SERVICIO PROFESIONAL',
      imagenPrincipal: '/images/productos/placeholder.svg',
      imagenes: ['/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg'],
      especificaciones: {
        color: 'Gris',
        peso: '28.57 kg',
        alto: '139.70 cm',
      },
      precioBase: 65000,
      unidadMedida: 'unidad/día',
      destacado: false,
      orden: 5,
      seoTitle: 'Lavamanos Portátiles',
      seoDescription: 'Estaciones de lavado de manos portátiles para obras, eventos y cocinas en Colombia.',
    },
    {
      slug: 'trailer-lujo',
      nombre: 'Trailer de Lujo',
      nombreCorto: 'Trailer',
      descripcion: 'Elegancia premium para eventos exclusivos. Restroom trailer de alta gama con múltiples cabinas, aire acondicionado, mármol, música y atención exclusiva.',
      descripcionCorta: 'Elegancia premium para eventos exclusivos.',
      categoriaSlug: 'premium',
      tipo: TipoProducto.PRODUCTO,
      badge: 'SERVICIO PROFESIONAL',
      imagenPrincipal: '/images/productos/placeholder.svg',
      imagenes: ['/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg'],
      especificaciones: {
        cabinas: '4 cabinas',
        aireAcondicionado: 'Sí',
        acabados: 'Mármol y madera',
        capacidad: '600 usos',
        atencion: 'Operarios incluidos',
      },
      precioBase: 1500000,
      unidadMedida: 'unidad/día',
      destacado: true,
      orden: 6,
      seoTitle: 'Restroom Trailer de Lujo en Colombia',
      seoDescription: 'Trailers de baños de lujo con aire acondicionado para eventos VIP, bodas y lanzamientos.',
    },
    {
      slug: 'operarios',
      nombre: 'Servicio de Operarios',
      nombreCorto: 'Operarios',
      descripcion: 'Personal especializado 24/7. Equipo capacitado para limpieza, abastecimiento y atención de las unidades durante todo el evento. Garantiza una experiencia impecable.',
      descripcionCorta: 'Personal especializado 24/7.',
      categoriaSlug: 'servicios',
      tipo: TipoProducto.SERVICIO,
      badge: 'SERVICIO PROFESIONAL',
      imagenPrincipal: '/images/productos/placeholder.svg',
      imagenes: ['/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg'],
      especificaciones: {
        turnos: '8 / 12 / 24 horas',
        operarios: '1 a 3 operarios',
        cobertura: 'Hasta 50 unidades',
        respuesta: '15 minutos',
      },
      precioBase: 120000,
      unidadMedida: 'jornada',
      destacado: false,
      orden: 7,
      seoTitle: 'Operarios para Baños Portátiles',
      seoDescription: 'Personal capacitado para mantenimiento y limpieza de unidades sanitarias durante tu evento.',
    },
    {
      slug: 'puntos-ecologicos',
      nombre: 'Puntos Ecológicos',
      nombreCorto: 'Ecológico',
      descripcion: 'Gestión sostenible de residuos. Unidades ecológicas que minimizan el consumo de agua y usan productos biodegradables. Ideales para eventos sostenibles y zonas verdes.',
      descripcionCorta: 'Gestión sostenible de residuos.',
      categoriaSlug: 'ecologico',
      tipo: TipoProducto.PRODUCTO,
      badge: 'SERVICIO PROFESIONAL',
      imagenPrincipal: '/images/productos/placeholder.svg',
      imagenes: ['/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg', '/images/productos/placeholder.svg'],
      especificaciones: {
        compartimentos: '4 compartimentos',
        capacidad: '240 L',
        material: 'Polietileno reciclado',
        dimensiones: '1.5 m x 0.8 m x 1.2 m',
      },
      precioBase: 95000,
      unidadMedida: 'unidad/día',
      destacado: false,
      orden: 8,
      seoTitle: 'Baños Ecológicos Portátiles',
      seoDescription: 'Unidades sanitarias ecológicas de bajo consumo de agua para eventos sostenibles en Colombia.',
    },
  ]

  for (const p of productosData) {
    const { categoriaSlug, ...data } = p
    await prisma.producto.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        categoriaId: getCatId(categoriaSlug),
      },
    })
  }
  console.log('✅ Productos creados')

  // ---------- Eventos ----------
  const eventosData = [
    { slug: 'alvaro-diaz-2025', nombre: 'Alvaro Díaz', anio: 2025, tipo: TipoEvento.CONCIERTO, ciudad: 'Bogotá', cantidadUnidades: 80, destacado: true },
    { slug: 'andme-2025', nombre: '&ME', anio: 2025, tipo: TipoEvento.CONCIERTO, ciudad: 'Bogotá', cantidadUnidades: 60, destacado: false },
    { slug: 'core-2025', nombre: 'CORE', anio: 2025, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 150, destacado: true },
    { slug: 'core-2024', nombre: 'CORE', anio: 2024, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 140, destacado: false },
    { slug: 'feria-manizales-2025', nombre: 'Feria de Manizales', anio: 2025, tipo: TipoEvento.FERIA, ciudad: 'Manizales', cantidadUnidades: 120, destacado: true },
    { slug: 'feria-flores-2024', nombre: 'Feria de las Flores', anio: 2024, tipo: TipoEvento.FERIA, ciudad: 'Medellín', cantidadUnidades: 200, destacado: true },
    { slug: 'feria-flores-2023', nombre: 'Feria de las Flores', anio: 2023, tipo: TipoEvento.FERIA, ciudad: 'Medellín', cantidadUnidades: 180, destacado: false },
    { slug: 'feria-flores-2022', nombre: 'Feria de las Flores', anio: 2022, tipo: TipoEvento.FERIA, ciudad: 'Medellín', cantidadUnidades: 160, destacado: false },
    { slug: 'feria-flores-2021', nombre: 'Feria de las Flores', anio: 2021, tipo: TipoEvento.FERIA, ciudad: 'Medellín', cantidadUnidades: 140, destacado: false },
    { slug: 'rancheton-arena-mix-2024', nombre: 'Rancheton Arena Mix / DOOM', anio: 2024, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 110, destacado: false },
    { slug: 'carl-cox-2024', nombre: 'Carl Cox', anio: 2024, tipo: TipoEvento.CONCIERTO, ciudad: 'Medellín', cantidadUnidades: 90, destacado: true },
    { slug: 'la-solar-2024', nombre: 'La Solar', anio: 2024, tipo: TipoEvento.FESTIVAL, ciudad: 'Medellín', cantidadUnidades: 130, destacado: true },
    { slug: 'ritvales-2023', nombre: 'Ritvales', anio: 2023, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 100, destacado: false },
    { slug: 'jazz-al-parque-2023', nombre: 'Jazz al Parque', anio: 2023, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 95, destacado: false },
    { slug: 'jazz-al-parque-2022', nombre: 'Jazz al Parque', anio: 2022, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 85, destacado: false },
    { slug: 'jazz-al-parque-2019', nombre: 'Jazz al Parque', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 80, destacado: false },
    { slug: 'fair-colombia-2023', nombre: 'F-AIR Colombia', anio: 2023, tipo: TipoEvento.FERIA, ciudad: 'Bogotá', cantidadUnidades: 70, destacado: false },
    { slug: 'joropo-al-parque-2023', nombre: 'Joropo al Parque', anio: 2023, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 75, destacado: false },
    { slug: 'salsa-al-parque-2023', nombre: 'Salsa al Parque', anio: 2023, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 120, destacado: false },
    { slug: 'salsa-al-parque-2022', nombre: 'Salsa al Parque', anio: 2022, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 110, destacado: false },
    { slug: 'salsa-al-parque-2019', nombre: 'Salsa al Parque', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 100, destacado: false },
    { slug: 'rock-al-parque-2022', nombre: 'Rock al Parque', anio: 2022, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 150, destacado: true },
    { slug: 'rock-al-parque-2019', nombre: 'Rock al Parque', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 140, destacado: false },
    { slug: 'expo-cundinamarca-2022', nombre: 'Expo Cundinamarca', anio: 2022, tipo: TipoEvento.FERIA, ciudad: 'Bogotá', cantidadUnidades: 65, destacado: false },
    { slug: 'hip-hop-al-parque-2022', nombre: 'Hip Hop al Parque', anio: 2022, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 105, destacado: false },
    { slug: 'hip-hop-al-parque-2019', nombre: 'Hip Hop al Parque', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 95, destacado: false },
    { slug: 'desfile-autos-clasicos-2022', nombre: 'Desfile Autos Clásicos', anio: 2022, tipo: TipoEvento.FERIA, ciudad: 'Medellín', cantidadUnidades: 130, destacado: false },
    { slug: 'alejandro-sanz-2022', nombre: 'La Gira Alejandro Sanz', anio: 2022, tipo: TipoEvento.CONCIERTO, ciudad: 'Bogotá', cantidadUnidades: 100, destacado: true },
    { slug: 'soda-stereo-2020', nombre: 'Soda Stereo', anio: 2020, tipo: TipoEvento.CONCIERTO, ciudad: 'Bogotá', cantidadUnidades: 170, destacado: true },
    { slug: 'beyond-wonderland-2019', nombre: 'Beyond Wonderland', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 115, destacado: false },
    { slug: 'foo-fighters-2019', nombre: 'Foo Fighters', anio: 2019, tipo: TipoEvento.CONCIERTO, ciudad: 'Bogotá', cantidadUnidades: 150, destacado: true },
    { slug: 'festival-tatacoa-2019', nombre: 'Festival Tatacoa', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Neiva', cantidadUnidades: 80, destacado: false },
    { slug: 'picnic-andres-2019', nombre: 'Picnic de Andrés', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 90, destacado: false },
    { slug: 'picnic-andres-2018', nombre: 'Picnic de Andrés', anio: 2018, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 85, destacado: false },
    { slug: 'picnic-andres-2017', nombre: 'Picnic de Andrés', anio: 2017, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 80, destacado: false },
    { slug: 'colombia-al-parque-2019', nombre: 'Colombia al Parque', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 100, destacado: false },
    { slug: 'festival-verano-bogota-2019', nombre: 'Festival de Verano Bogotá', anio: 2019, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 160, destacado: false },
    { slug: 'festival-verano-bogota-2017', nombre: 'Festival de Verano Bogotá', anio: 2017, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 150, destacado: false },
    { slug: 'festival-verano-bogota-2016', nombre: 'Festival de Verano Bogotá', anio: 2016, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 140, destacado: false },
    { slug: 'festival-verano-bogota-2015', nombre: 'Festival de Verano Bogotá', anio: 2015, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 130, destacado: false },
    { slug: 'luis-miguel-2019', nombre: 'Luis Miguel', anio: 2019, tipo: TipoEvento.CONCIERTO, ciudad: 'Bogotá', cantidadUnidades: 120, destacado: true },
    { slug: 'estereo-picnic-2018', nombre: 'Estéreo Picnic', anio: 2018, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 200, destacado: true },
    { slug: 'i-love-bogota-2018', nombre: 'I Love Bogotá', anio: 2018, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 95, destacado: false },
    { slug: 'shakira-el-dorado-2018', nombre: 'Shakira El Dorado', anio: 2018, tipo: TipoEvento.CONCIERTO, ciudad: 'Medellín', cantidadUnidades: 220, destacado: true },
    { slug: 'be-you-fest-2018', nombre: 'Festival Be You Fest', anio: 2018, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 70, destacado: false },
    { slug: 'papa-francisco-2017', nombre: 'Visita del Papa Francisco', anio: 2017, tipo: TipoEvento.GOBIERNO, ciudad: 'Medellín', cantidadUnidades: 500, destacado: true },
    { slug: 'jamming-summer-fest-2017', nombre: 'Jamming Summer Fest', anio: 2017, tipo: TipoEvento.FESTIVAL, ciudad: 'Bogotá', cantidadUnidades: 85, destacado: false },
  ]

  for (const e of eventosData) {
    await prisma.evento.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        ...e,
        descripcion: `Junisama acompañó el evento ${e.nombre} en ${e.ciudad} con ${e.cantidadUnidades} unidades sanitarias portátiles.`,
        imagenPrincipal: '/images/eventos/placeholder.svg',
        imagenes: ['/images/eventos/placeholder.svg', '/images/eventos/placeholder.svg'],
        productosUsados: ['Baños Estándar', 'Baño VIP', 'Lavamanos'],
        estado: "PUBLICADO",
      },
    })
  }
  console.log('✅ Eventos creados')

  // ---------- FAQs ----------
  const faqsData = [
    { pregunta: '¿Qué tipos de baños portátiles alquilan?', respuesta: 'Contamos con baños VIP, estándar, para personas con discapacidad, eléctricos, lavamanos portátiles, trailers de lujo y puntos ecológicos.', categoria: CategoriaFaq.PRODUCTOS, orden: 1 },
    { pregunta: '¿Incluyen operarios para el mantenimiento?', respuesta: 'Sí, ofrecemos operarios capacitados para mantenimiento, limpieza y abastecimiento durante toda la duración de tu evento.', categoria: CategoriaFaq.SERVICIOS, orden: 2 },
    { pregunta: '¿En qué ciudades de Colombia prestan servicio?', respuesta: 'Tenemos cobertura a nivel nacional con sedes principales en Medellín y Bogotá. Atendemos eventos en principales ciudades y zonas rurales del país.', categoria: CategoriaFaq.GENERAL, orden: 3 },
    { pregunta: '¿Cuánto tiempo de antelación necesitan para reservar?', respuesta: 'Recomendamos reservar con la mayor antelación posible, especialmente para eventos masivos. Sin embargo, contamos con capacidad logística para atender emergencias y reservas de último momento según disponibilidad.', categoria: CategoriaFaq.EVENTOS, orden: 4 },
    { pregunta: '¿Los productos son biodegradables?', respuesta: 'Sí, manejamos insumos biodegradables y contamos con puntos ecológicos de bajo consumo de agua, certificados bajo estándares ambientales.', categoria: CategoriaFaq.PRODUCTOS, orden: 5 },
    { pregunta: '¿Cuál es la capacidad de atención por evento?', respuesta: 'Hemos atendido eventos de hasta 500+ unidades simultáneas. La capacidad se define según el número de asistentes, duración y tipo de evento.', categoria: CategoriaFaq.EVENTOS, orden: 6 },
    { pregunta: '¿Ofrecen servicio de emergencia o última hora?', respuesta: 'Sí, tenemos un equipo de respuesta rápida disponible 24/7 para atender necesidades de emergencia y eventos de última hora.', categoria: CategoriaFaq.SERVICIOS, orden: 7 },
    { pregunta: '¿Qué incluye el mantenimiento durante el evento?', respuesta: 'Incluye limpieza profunda, desinfección certificada, reposición de insumos, monitoreo continuo y revisión técnica de las unidades.', categoria: CategoriaFaq.SERVICIOS, orden: 8 },
    { pregunta: '¿Tienen seguro de responsabilidad civil?', respuesta: 'Sí, contamos con seguro de responsabilidad civil para todos nuestros servicios, garantizando tranquilidad a nuestros clientes.', categoria: CategoriaFaq.GENERAL, orden: 9 },
    { pregunta: '¿Cómo se realiza el proceso de cotización?', respuesta: 'Puedes solicitar una cotización a través de nuestro formulario web, WhatsApp o llamando a nuestras líneas de atención. Un asesor te contactará en menos de 24 horas con una propuesta a la medida.', categoria: CategoriaFaq.PRECIOS, orden: 10 },
  ]

  for (let i = 0; i < faqsData.length; i++) {
    const f = faqsData[i]
    await prisma.faq.upsert({
      where: { id: `faq-${String(i + 1).padStart(3, '0')}` },
      update: {},
      create: {
        id: `faq-${String(i + 1).padStart(3, '0')}`,
        ...f,
      },
    })
  }
  console.log('✅ FAQs creadas')

  // ---------- Clientes de ejemplo ----------
  await prisma.cliente.upsert({
    where: { id: 'cliente-ejemplo-001' },
    update: {},
    create: {
      id: 'cliente-ejemplo-001',
      nombreEmpresa: 'Eventos Ejemplo S.A.S',
      nombreContacto: 'Carlos Pérez',
      email: 'eventos@ejemplo.com',
      telefono: '+57 300 123 4567',
      sector: 'Eventos',
      ciudad: 'Medellín',
      fuente: FuenteCliente.WEB,
      estado: EstadoCliente.ACTIVO,
    },
  })
  console.log('✅ Cliente de ejemplo creado')

  console.log('🎉 Seed completado exitosamente')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
