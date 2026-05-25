import Link from 'next/link';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PropertyCard } from '@/components/property-card';
import { getPropertiesPage } from '@/services/propertyService';
import { getAgents } from '@/services/agentService';
import { getPropertyImages } from '@/services/propertyService';
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
        <FilterSidebar />
      </aside>
      <section className="space-y-8">
        <div className="flex flex-col gap-4 rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Explore listings</p>
            <h1 className="mt-3 text-3xl font-semibold text-zinc-950">Verified Hyderabad properties</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
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
            <Link href="/dashboard/agent" className="inline-flex h-11 items-center rounded-full border border-zinc-200 px-4 text-xs sm:h-12 sm:px-5 sm:text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50">
              Agent dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {topProperties.length > 0 ? (
            await Promise.all(topProperties.map(async (property) => {
              const agent = agents.find((item) => item.id === property.agent_id);
              const images = await getPropertyImages(property.id);
              return agent ? (
                <PropertyCard
                  key={property.id}
                  property={property}
                  agentName={agent.name}
                  agentWhatsapp={agent.whatsapp}
                  images={images}
                />
              ) : null;
            }))
          ) : (
            <div className="col-span-full rounded-[2.5rem] bg-white p-6 text-center shadow-soft sm:p-8 lg:p-14">
              <p className="text-zinc-600">No properties available yet.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 rounded-full border border-zinc-200 bg-white px-6 py-4 shadow-soft">
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
