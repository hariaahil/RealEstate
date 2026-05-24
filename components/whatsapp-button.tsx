'use client';

export function WhatsAppButton({ phone, message }: { phone: string; message: string }) {
  const url = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 inline-flex h-14 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white shadow-soft transition hover:bg-emerald-700 md:bottom-8 md:right-8"
    >
      Chat on WhatsApp
    </a>
  );
}
