export const siteConfig = {
  name: "BOGA",
  fullName: "BOGA — Ingeniería Portátil",
  legalName: "BOGA Ingeniería Portátil S.A.S.",
  tagline: "Elevamos el estándar de tus eventos.",
  url: "https://boga.com.co",
  logo: "https://boga.com.co/logo.svg",

  phone: "+57 350 708 9584",
  phoneRaw: "573507089584",
  email: "soporte@boga.com.co",
  whatsapp: "573507089584",
  whatsappMessage: "Hola BOGA, me gustaría recibir información sobre sus servicios.",

  locale: "es_CO",
  language: "es-CO",

  addresses: [
    {
      city: "Medellín",
      street: "Calle 13 sur #51C-54",
      country: "CO",
    },
    {
      city: "Bogotá",
      street: "Cra 58b bis #131A 51",
      country: "CO",
    },
  ],

  social: {
    instagram: {
      handle: "@boga_inversiones",
      url: "https://www.instagram.com/boga_inversiones/",
    },
    linkedin: {
      handle: "BOGA Ingeniería Portátil",
      url: "https://www.linkedin.com/company/boga/",
    },
  },

  admin: {
    email: "admin@boga.com.co",
    password: "Boga2025!",
  },
}

export type SiteConfig = typeof siteConfig
