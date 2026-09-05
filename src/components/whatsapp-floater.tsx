import { MessageCircle } from "lucide-react";

export function WhatsAppFloater() {
  return (
    <a
      href="https://wa.me/919909393649?text=Hi%20Clinexcel%20Academy%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20training%20programs."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-whatsapp px-4 py-3.5 text-white shadow-elevated ring-4 ring-whatsapp/20 transition-all hover:scale-105 hover:ring-whatsapp/30"
    >
      <span className="relative flex h-6 w-6 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40 opacity-60" />
        <MessageCircle className="relative h-6 w-6" />
      </span>
      <span className="hidden text-sm font-semibold sm:inline">Chat with us</span>
    </a>
  );
}
