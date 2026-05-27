import Link from 'next/link';
import { Suspense } from 'react';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PropertyCard } from '@/components/property-card';
import { getPropertiesPage } from '@/services/propertyService';
import { getAgents } from '@/services/agentService';
import { getPropertyImages } from '@/services/propertyService';
import { InPagePushAd } from '@/components/ads/InPagePushAd';
import type { Property, Agent, PropertyImage } from '@/types';

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'price_low_high', label: 'Price: Low to High' },
  { value: 'price_high_low', label: 'Price: High to Low' },
  { value: 'sqft_low_high', label: 'Size: Smallest' },
  { value: 'sqft_high_low', label: 'Size: Largest' },
] as const;

export default async function PropertiesPage({ searchParams }: { searchParams: { page?: string; sort?: string; locality?: string; minPrice?: string; maxPrice?: string; bhk?: string } }) {
  const page = Number(searchParams.page ?? '1');
  const sort = (searchParams.sort as string) ?? 'latest';
  const locality = searchParams.locality;
  const minPrice = Number(searchParams.minPrice ?? '0') || undefined;
  const maxPrice = Number(searchParams.maxPrice ?? '0') || undefined;
  const bhk = Number(searchParams.bhk ?? '0') || undefined;
  const pageSize = 9;

  const { properties, total } = await getPropertiesPage({ page, pageSize, sort: sort as any, locality, minRent: minPrice, maxRent: maxPrice, bhk });
  const agents = await getAgents();
  const topProperties = properties.filter((property) => property.status === 'approved');
  const lastPage = total > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  const currentSearchParams = new URLSearchParams();
  if (locality) currentSearchParams.set('locality', locality);
  if (searchParams.minPrice) currentSearchParams.set('minPrice', searchParams.minPrice);
  if (searchParams.maxPrice) currentSearchParams.set('maxPrice', searchParams.maxPrice);
  if (searchParams.bhk) currentSearchParams.set('bhk', searchParams.bhk);
  if (sort) currentSearchParams.set('sort', sort);

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[330px_1fr] lg:px-8">
      <aside className="lg:sticky lg:top-24">
        <Suspense fallback={<div className="rounded-[2rem] border border-zinc-200 bg-white p-5 text-sm text-zinc-500 shadow-soft sm:p-6">Loading filters…</div>}>
          <FilterSidebar />
        </Suspense>
      </aside>
      <section className="space-y-8">
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-4 shadow-soft sm:rounded-[2.5rem] sm:p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Explore listings</p>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-950">Verified Hyderabad properties</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex w-full flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-700 sm:w-auto sm:rounded-full sm:px-4">
              <span className="font-semibold">Sort:</span>
              {sortOptions.map((option) => {
                const params = new URLSearchParams(currentSearchParams);
                params.set('sort', option.value);
                params.set('page', '1');
                return (
                  <Link
                    key={option.value}
                    href={`/properties?${params.toString()}`}
                    className={`rounded-full px-3 py-1 transition ${option.value === sort ? 'bg-brand-600 text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
                  >
                    {option.label}
                  </Link>
                );
              })}
            </div>
            <Link href="/dashboard/agent" className="inline-flex h-11 w-full items-center justify-center rounded-full border border-zinc-200 px-4 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-50 sm:h-12 sm:w-auto sm:px-5 sm:text-sm">
              Agent dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {topProperties.length > 0 ? (
            (() => {
              const propertyCards = topProperties.map(async (property, index) => {
                const agent = agents.find((item) => item.id === property.agent_id);
                const images = await getPropertyImages(property.id);

                if (!agent) return null;

                return (
                  <div key={property.id} className="contents">
                    <PropertyCard
                      property={property}
                      agentName={agent.name}
                      agentWhatsapp={agent.whatsapp}
                      images={images}
                    />
                    {(index + 1) % 6 === 0 ? (
                      <div key={`ad-${property.id}`} className="sm:col-span-2 xl:col-span-3">
                        <InPagePushAd placement={`properties-after-card-${index + 1}`} className="px-0" />
                      </div>
                    ) : null}
                  </div>
                );
              });

              return Promise.all(propertyCards);
            })()
          ) : (
            <div className="col-span-full rounded-[2.5rem] bg-white p-6 text-center shadow-soft sm:p-8 lg:p-14">
              <p className="text-zinc-600">No properties available yet.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-zinc-200 bg-white px-4 py-4 shadow-soft sm:flex-row sm:gap-4 sm:rounded-full sm:px-6">
          <Link
            href={`/properties?${new URLSearchParams({
              ...Object.fromEntries(currentSearchParams.entries()),
              page: String(Math.max(1, page - 1)),
            }).toString()}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Previous
          </Link>
          <span className="text-sm text-zinc-500">Page {page} of {lastPage}</span>
          <Link
            href={`/properties?${new URLSearchParams({
              ...Object.fromEntries(currentSearchParams.entries()),
              page: String(Math.min(lastPage, page + 1)),
            }).toString()}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Next
          </Link>
        </div>
      </section>
    </div>
  );
}
