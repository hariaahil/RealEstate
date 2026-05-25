import { getPropertiesPage } from '@/services/propertyService';
import { getAgents } from '@/services/agentService';
import { PropertyCard } from '@/components/property-card';
import { FilterSidebar } from '@/components/filter-sidebar';
import { SearchBar } from '@/components/search-bar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Rentals | HydPropertyHub',
  description: 'Browse verified rental properties in Hyderabad. Luxury apartments, PGs, and more.',
};

export default async function RentalsPage() {
  const { properties } = await getPropertiesPage({ listingCategory: 'rent', pageSize: 12 });
  const agents = properties.length > 0 ? await getAgents() : [];
  const agentById = new Map(agents.map((agent) => [agent.id, agent] as const));
  const propertiesWithAgent = properties.map((property) => ({
    property,
    agent: agentById.get(property.agent_id),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-semibold text-zinc-950 sm:text-4xl">Premium Rental Properties</h1>
        <p className="max-w-2xl text-zinc-600">Discover verified rental homes across Hyderabad with trusted agents.</p>
        <div className="max-w-xl">
          <SearchBar initialCategory="rent" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FilterSidebar initialCategory="rent" />
        
        <div className="space-y-6">
          {properties.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {propertiesWithAgent.map(({ property, agent }) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  agentName={agent?.name ?? 'HydPropertyHub Agent'}
                  agentWhatsapp={agent?.whatsapp}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-12 text-center shadow-soft">
              <p className="text-lg font-medium text-zinc-900">No rental properties found</p>
              <p className="mt-2 text-zinc-600">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
