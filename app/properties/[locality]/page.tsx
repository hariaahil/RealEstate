import { PropertyCard } from '@/components/property-card';
import { getAgents } from '@/services/agentService';
import { getPropertyImages, getPropertiesPage } from '@/services/propertyService';
import { InPagePushAd } from '@/components/ads/InPagePushAd';
import type { Property } from '@/types';

export default async function LocalityPage({ params }: { params: { locality: string } }) {
  const locality = params.locality.replace(/-/g, ' ');
  const { properties } = await getPropertiesPage({ locality, page: 1, pageSize: 12 });
  const agents = await getAgents();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Locality</p>
          <h1 className="mt-3 text-3xl font-semibold text-zinc-950 sm:text-4xl">Properties in {locality}</h1>
          <p className="mt-4 max-w-3xl text-zinc-600">Browse available listings in {locality}, including premium homes, villas, apartments and gated residences from top local agents.</p>
        </div>

        {properties.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white p-8 text-center shadow-soft">
            <h2 className="text-2xl font-semibold text-zinc-950">No results found</h2>
            <p className="mt-4 text-zinc-600">We couldn’t find any properties in this locality yet. Please check back later or try another neighborhood.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {await Promise.all(properties.map(async (property, index) => {
              const agent = agents.find((item) => item.id === property.agent_id);
              const images = await getPropertyImages(property.id);
              return agent ? (
                <div key={property.id} className="contents">
                  <PropertyCard
                    property={property}
                    agentName={agent.name}
                    agentWhatsapp={agent.whatsapp}
                    images={images}
                  />
                  {(index + 1) % 6 === 0 ? (
                    <div className="sm:col-span-2 xl:col-span-3">
                      <InPagePushAd placement={`locality-after-card-${index + 1}`} className="px-0" />
                    </div>
                  ) : null}
                </div>
              ) : null;
            }))}
          </div>
        )}
      </div>
    </div>
  );
}
