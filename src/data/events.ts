export interface Event {
  id: string
  name: string
  years: number[]
  type: "festival" | "concierto" | "feria" | "corporativo" | "privado"
  highlighted?: boolean
  /** Portada del álbum en la grilla. */
  image: string
  /** Álbum explícito. Si no hay, se genera con stock de baños / equipos BOGA. */
  album?: string[]
}

/** Stock compartido: baños portátiles e infraestructura de evento. */
const ALBUM_SANITATION = [
  "/images/eventos/albums/_shared/banos-fila-crepusculo.jpg",
  "/images/eventos/albums/_shared/banos-verdes.jpg",
  "/images/eventos/albums/_shared/banos-coloridos-calle.jpg",
  "/images/eventos/albums/_shared/banos-noche.jpg",
  "/images/eventos/albums/_shared/bano-azul-exterior.jpg",
  "/images/eventos/albums/_shared/banos-obra.jpg",
  "/images/eventos/albums/alvaro-diaz/07-bano-evento.jpg",
  "/images/eventos/albums/alvaro-diaz/06-banos-portatiles.jpg",
  "/images/eventos/albums/alvaro-diaz/08-unidades-sanitarias.jpg",
] as const

/** Equipos y operación BOGA (tema del servicio en el evento). */
const ALBUM_BOGA = [
  "/images/eventos/albums/_shared/bano-vip-photo.jpg",
  "/images/eventos/albums/_shared/bano-estandar-photo.jpg",
  "/images/eventos/albums/_shared/discapacitados-photo.jpg",
  "/images/eventos/albums/_shared/electricos-photo.jpg",
  "/images/eventos/albums/_shared/lavamanos-photo.jpg",
  "/images/eventos/albums/_shared/trailer-lujo-photo.jpg",
  "/images/eventos/albums/_shared/operarios-photo.jpg",
  "/images/eventos/albums/_shared/puntos-ecologicos-photo.jpg",
] as const

const ALBUM_POOL = [...ALBUM_SANITATION, ...ALBUM_BOGA]

function hashId(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0
  }
  return h
}

/** Genera un álbum independiente por evento (portada + stock temático). */
function buildThematicAlbum(event: Event): string[] {
  const h = hashId(event.id)
  // 4–8 fotos en total (incluye portada); destacados un poco más largos
  const total = event.highlighted ? 6 + (h % 3) : 4 + (h % 3)
  const extras = Math.max(3, total - 1)
  const start = h % ALBUM_POOL.length
  const step = 2 + (h % 3)

  const picked: string[] = []
  for (let i = 0; i < extras && picked.length < extras; i++) {
    const src = ALBUM_POOL[(start + i * step) % ALBUM_POOL.length]
    if (src !== event.image && !picked.includes(src)) picked.push(src)
  }

  // Relleno si el paso dejó huecos
  for (const src of ALBUM_POOL) {
    if (picked.length >= extras) break
    if (src !== event.image && !picked.includes(src)) picked.push(src)
  }

  return [event.image, ...picked]
}

export function getEventAlbum(event: Event): string[] {
  if (event.album && event.album.length > 1) return event.album
  return buildThematicAlbum(event)
}

export const events: Event[] = [
  // 2025
  {
    id: "alvaro-diaz-2025",
    name: "Alvaro Díaz",
    years: [2025],
    type: "concierto",
    highlighted: true,
    image: "/images/eventos/alvaro-diaz-2025.jpg",
    album: [
      "/images/eventos/alvaro-diaz-2025.jpg",
      "/images/eventos/albums/alvaro-diaz/07-bano-evento.jpg",
      "/images/eventos/albums/alvaro-diaz/06-banos-portatiles.jpg",
      "/images/eventos/albums/alvaro-diaz/08-unidades-sanitarias.jpg",
      "/images/eventos/albums/alvaro-diaz/09-boga-vip.jpg",
      "/images/eventos/albums/alvaro-diaz/10-boga-puntos.jpg",
      "/images/eventos/albums/alvaro-diaz/11-boga-operarios.jpg",
      "/images/eventos/albums/alvaro-diaz/12-boga-lavamanos.jpg",
      "/images/eventos/albums/_shared/banos-noche.jpg",
      "/images/eventos/albums/_shared/bano-estandar-photo.jpg",
    ],
  },
  { id: "andme-2025", name: "&ME", years: [2025], type: "concierto", highlighted: true, image: "/images/eventos/andme-2025.jpg" },
  { id: "core-2025", name: "CORE", years: [2025, 2024], type: "festival", highlighted: true, image: "/images/eventos/core-2025.jpg" },
  { id: "feria-manizales-2025", name: "Feria de Manizales", years: [2025], type: "feria", highlighted: true, image: "/images/eventos/feria-manizales-2025.jpg" },
  { id: "feria-flores-2025", name: "Feria de las Flores", years: [2025, 2024, 2023, 2022, 2021], type: "feria", highlighted: true, image: "/images/eventos/feria-flores-2025.jpg" },
  // 2024
  { id: "rancheton-2024", name: "RANCHETON ARENA MIX", years: [2024], type: "concierto", image: "/images/eventos/rancheton-2024.jpg" },
  { id: "doom-2024", name: "DOOM", years: [2024], type: "concierto", image: "/images/eventos/doom-2024.jpg" },
  { id: "carl-cox-2024", name: "Carl Cox", years: [2024], type: "concierto", highlighted: true, image: "/images/eventos/carl-cox-2024.jpg" },
  { id: "la-solar-2024", name: "La Solar", years: [2024], type: "concierto", highlighted: true, image: "/images/eventos/la-solar-2024.jpg" },
  // 2023
  { id: "ritvales-2023", name: "RITVALES", years: [2023], type: "festival", image: "/images/eventos/ritvales-2023.jpg" },
  { id: "jazz-al-parque-2023", name: "JAZZ al Parque", years: [2023, 2022, 2019], type: "festival", image: "/images/eventos/jazz-al-parque-2023.jpg" },
  { id: "f-air-2023", name: "F-AIR Colombia", years: [2023], type: "feria", image: "/images/eventos/f-air-2023.jpg" },
  { id: "joropo-al-parque-2023", name: "Joropo al Parque", years: [2023], type: "festival", image: "/images/eventos/joropo-al-parque-2023.jpg" },
  { id: "salsa-al-parque-2023", name: "Salsa al Parque", years: [2023, 2022, 2019], type: "festival", image: "/images/eventos/salsa-al-parque-2023.jpg" },
  // 2022
  { id: "rock-al-parque-2022", name: "Rock al Parque", years: [2022, 2019], type: "festival", highlighted: true, image: "/images/eventos/rock-al-parque-2022.jpg" },
  { id: "expo-cundinamarca-2022", name: "EXPO Cundinamarca", years: [2022], type: "feria", image: "/images/eventos/expo-cundinamarca-2022.jpg" },
  { id: "hip-hop-al-parque-2022", name: "Hip Hop al Parque", years: [2022, 2019], type: "festival", image: "/images/eventos/hip-hop-al-parque-2022.jpg" },
  { id: "desfile-autos-clasicos-2022", name: "Desfile Autos Clásicos", years: [2022], type: "privado", image: "/images/eventos/desfile-autos-clasicos-2022.jpg" },
  { id: "alejandro-sanz-2022", name: "La Gira Alejandro Sanz", years: [2022], type: "concierto", highlighted: true, image: "/images/eventos/alejandro-sanz-2022.jpg" },
  // 2020
  { id: "soda-stereo-2020", name: "SODA STEREO — Gracias Totales", years: [2020], type: "concierto", highlighted: true, image: "/images/eventos/soda-stereo-2020.jpg" },
  // 2019
  { id: "beyond-wonderland-2019", name: "Beyond Wonderland", years: [2019], type: "festival", image: "/images/eventos/beyond-wonderland-2019.jpg" },
  { id: "foo-fighters-2019", name: "FOO FIGHTERS", years: [2019], type: "concierto", highlighted: true, image: "/images/eventos/foo-fighters-2019.jpg" },
  { id: "festival-tatacoa-2019", name: "Festival Tatacoa", years: [2019], type: "festival", image: "/images/eventos/festival-tatacoa-2019.jpg" },
  { id: "picnic-andres-2019", name: "Picnic de Andrés", years: [2019, 2018, 2017], type: "privado", image: "/images/eventos/picnic-andres-2019.jpg" },
  { id: "colombia-al-parque-2019", name: "Colombia al Parque", years: [2019], type: "festival", image: "/images/eventos/colombia-al-parque-2019.jpg" },
  { id: "festival-verano-2019", name: "Festival de Verano Bogotá", years: [2019, 2017, 2016, 2015], type: "festival", image: "/images/eventos/festival-verano-2019.jpg" },
  { id: "luis-miguel-2019", name: "Luis Miguel — México por Siempre", years: [2019], type: "concierto", highlighted: true, image: "/images/eventos/luis-miguel-2019.jpg" },
  // 2018
  { id: "stereo-picnic-2018", name: "STEREO PICNIC", years: [2018], type: "festival", highlighted: true, image: "/images/eventos/stereo-picnic-2018.jpg" },
  { id: "i-love-bogota-2018", name: "I Love Bogotá", years: [2018], type: "festival", image: "/images/eventos/i-love-bogota-2018.jpg" },
  { id: "shakira-2018", name: "Shakira — El Dorado World Tour", years: [2018], type: "concierto", highlighted: true, image: "/images/eventos/shakira-2018.jpg" },
  { id: "be-you-fest-2018", name: "Festival Be You Fest", years: [2018], type: "festival", image: "/images/eventos/be-you-fest-2018.jpg" },
  // 2017
  { id: "papa-francisco-2017", name: "Visita del Papa Francisco", years: [2017], type: "corporativo", highlighted: true, image: "/images/eventos/papa-francisco-2017.jpg" },
  { id: "jamming-summer-2017", name: "Jamming Summer Fest", years: [2017], type: "festival", image: "/images/eventos/jamming-summer-2017.jpg" },
]

export const eventTypeLabels: Record<string, string> = {
  festival: "Festival",
  concierto: "Concierto",
  feria: "Feria",
  corporativo: "Corporativo",
  privado: "Privado",
}

export const eventYears = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015]
