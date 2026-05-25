"use client";

import Link from 'next/link';
import { useState } from 'react';
import type { Property } from '@/types';
import { formatCurrency } from '@/lib/utils';

export function FeaturedCarousel({ properties }: { properties: Property[] }) {
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, true>>({});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-brand-600">Featured listings</p>
          <h2 className="text-2xl font-semibold text-zinc-950 sm:text-3xl">Premium Hyderabad homes.</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <article key={property.id} className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-2xl">
            <div className="relative h-60 bg-zinc-100">
              {property.image_url && !brokenImageIds[property.id] ? (
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="h-full w-full object-cover"
                  onError={() => setBrokenImageIds((prev) => ({ ...prev, [property.id]: true }))}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-400">
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm text-zinc-500">{property.locality} • {property.bhk} BHK</p>
              <h3 className="text-xl font-semibold text-zinc-900">{property.title}</h3>
              <p className="text-sm text-zinc-600">{formatCurrency(property.price)}</p>
              <Link href={`/properties/${property.locality.toLowerCase().replace(/\s+/g, '-')}/${property.slug}`} className="inline-flex text-sm font-semibold text-brand-600 hover:text-brand-700">
                Explore now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
