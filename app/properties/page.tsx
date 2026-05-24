import Link from 'next/link';
import { sampleAgents } from '@/lib/sampleData';
import { FilterSidebar } from '@/components/filter-sidebar';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { getProperties } from '@/services/propertyService';
import { getAgents } from '@/services/agentService';
import type { Property, Agent } from '@/types';

export default async function PropertiesPage() {
  const properties = await getProperties();
  const agents = await getAgents();
  const topProperties = properties.filter((property) => property.status === 'approved');

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
            <Button variant="outline" size="sm">Sort by latest</Button>
            <Link href="/dashboard/agent" className="inline-flex h-11 items-center rounded-full border border-zinc-200 px-4 text-xs sm:h-12 sm:px-5 sm:text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50">
              Agent dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {topProperties.length > 0 ? (
            topProperties.map((property) => {
              const agent = agents.find((item) => item.id === property.agent_id);
              return agent ? <PropertyCard key={property.id} property={property} agentName={agent.name} /> : null;
            })
          ) : (
            <div className="col-span-full rounded-[2.5rem] bg-white p-6 text-center shadow-soft sm:p-8 lg:p-14">
              <p className="text-zinc-600">No properties available yet.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 rounded-full border border-zinc-200 bg-white px-6 py-4 shadow-soft">
          <Button variant="ghost" size="sm">Previous</Button>
          <span className="text-sm text-zinc-500">Page 1 of 5</span>
          <Button variant="ghost" size="sm">Next</Button>
        </div>
      </section>
    </div>
  );
}
