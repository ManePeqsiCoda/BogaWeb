import Link from "next/link"
import { MessageCircle } from "lucide-react"

const WHATSAPP_NUMBER = "573507089584"
const WHATSAPP_MESSAGE =
  "Hola, me gustaría recibir información sobre sus servicios"

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-whatsapp/50"
      aria-label="Contáctanos por WhatsApp"
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-30" />
      <MessageCircle className="relative h-7 w-7 fill-current" />
    </Link>
  )
}
