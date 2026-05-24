import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FavoriteButton } from '@/components/favorite-button';
import type { Property, PropertyImage } from '@/types';

type PropertyCardProps = {
  property: Property;
  agentName: string;
  agentWhatsapp?: string;
  images?: PropertyImage[];
};

export function PropertyCard({ property, agentName, agentWhatsapp, images }: PropertyCardProps) {
  const mainImage = images && images.length > 0 ? images[0].image_url : null;
  const whatsappNumber = agentWhatsapp ? agentWhatsapp.replace(/\D/g, '') : '919000000000';
  
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-64 overflow-hidden bg-zinc-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={property.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            <span className="text-sm">No image available</span>
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {property.verified && <Badge variant="success">Verified</Badge>}
          {property.featured && <Badge variant="outline">Featured</Badge>}
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">{property.property_type}</p>
          <span className="text-sm font-semibold text-zinc-700">{property.bhk} BHK</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-zinc-900">{property.title}</h3>
          <p className="mt-2 text-sm text-zinc-600">{property.locality}, {property.city}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm text-zinc-500">
          <span>{formatCurrency(property.price)}</span>
          <span>{property.sqft} sqft</span>
          <span>{agentName}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <FavoriteButton propertyId={property.id} />
          <Link href={`/properties/${property.locality.toLowerCase().replace(/\s+/g, '-')}/${property.slug}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View details
          </Link>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi HydPropertyHub, I'm interested in ${property.title}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
