'use client';

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Property } from '@/types';

type ViewedProperty = {
  id: string;
  title: string;
  locality: string;
  city: string;
  slug: string;
  image_url?: string;
  price: number;
};

type RecentlyViewedProps = {
  current?: ViewedProperty;
};

export function RecentlyViewed({ current }: RecentlyViewedProps) {
  const [items, setItems] = useState<ViewedProperty[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recently_viewed_properties');
    const parsed: ViewedProperty[] = stored ? JSON.parse(stored) : [];
    const nextList = parsed.filter((item) => item.id !== current?.id);

    if (current) {
      nextList.unshift(current);
    }

    const uniqueList = nextList.filter((item, index, self) => self.findIndex((other) => other.id === item.id) === index);
    const trimmed = uniqueList.slice(0, 4);
    localStorage.setItem('recently_viewed_properties', JSON.stringify(trimmed));
    setItems(trimmed.filter((item) => item.id !== current?.id));
  }, [current]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Recently viewed</p>
          <h2 className="text-xl font-semibold text-zinc-950">Keep browsing</h2>
        </div>
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/properties/${item.locality.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`}
            className="rounded-3xl border border-zinc-200 p-4 transition hover:border-brand-500"
          >
            <div className="flex items-start gap-4">
              {item.image_url ? (
                <div className="h-16 w-20 overflow-hidden rounded-3xl bg-zinc-100">
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-20 items-center justify-center rounded-3xl bg-zinc-100 text-xs text-zinc-500">No image</div>
              )}
              <div>
                <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                <p className="text-sm text-zinc-500">{item.locality}, {item.city}</p>
                <p className="mt-1 text-sm font-semibold text-brand-600">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
