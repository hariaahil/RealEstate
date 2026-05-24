import Link from 'next/link';
import { featuredLocalities } from '@/lib/sampleData';
import { FeaturedCarousel } from '@/components/featured-carousel';
import { SearchBar } from '@/components/search-bar';
import { StatsSection } from '@/components/stats-section';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { Button } from '@/components/ui/button';
import { getProperties } from '@/services/propertyService';
import { getAgents } from '@/services/agentService';
import type { Property, Agent } from '@/types';

export default async function HomePage() {
  const properties = await getProperties();
  const agents = await getAgents();
  const featuredProperties = properties.filter((property) => property.featured);
  return (
    <div className="space-y-12 px-4 pb-16 pt-8 sm:px-6 lg:space-y-20 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8 lg:p-14">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-4">
            <p className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 sm:px-4 sm:py-2 sm:text-sm">
              Verified Hyderabad Listings
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl lg:text-5xl xl:text-6xl">
              HydPropertyHub — curated, premium homes across Hyderabad.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
              Discover trusted properties from verified agents only. Search luxury apartments, villas and investor-ready spaces in prime Hyderabad localities.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button className="h-11 px-5 sm:h-12 sm:px-6">Explore listings</Button>
              <Link href="/properties" className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:h-12 sm:px-6">
                Browse all properties
              </Link>
            </div>
          </div>
          <div className="space-y-5 rounded-[2rem] bg-zinc-950 p-6 text-white shadow-soft sm:p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300 sm:text-sm">Start your search</p>
            <div className="space-y-3">
              <p className="text-xl font-semibold sm:text-2xl">Find the perfect property in Hyderabad.</p>
              <p className="text-sm leading-7 text-zinc-300">Search by locality, property type, budget and agent specialization with a premium curated experience.</p>
            </div>
            <SearchBar />
            <div className="grid gap-3 rounded-3xl bg-zinc-900/80 p-4 sm:p-6">
              {featuredLocalities.slice(0, 4).map((location) => (
                <div key={location} className="rounded-3xl bg-zinc-800/90 px-3 py-2.5 text-xs text-zinc-100 shadow-sm sm:px-4 sm:py-3 sm:text-sm">
                  {location}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {featuredProperties.length > 0 ? (
          <FeaturedCarousel properties={featuredProperties} />
        ) : (
          <div className="rounded-[2.5rem] bg-white p-6 text-center shadow-soft sm:p-8 lg:p-14">
            <p className="text-zinc-600">No featured properties available yet.</p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8 lg:p-14">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-600">Featured localities</p>
            <h2 className="text-2xl font-semibold text-zinc-950 sm:text-3xl">Hyderabad neighborhoods curated for modern buyers.</h2>
            <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">From Hitech City to Kukatpally, browse premium listings in Hyderabad’s most sought-after localities.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
            {featuredLocalities.map((locality) => (
              <div key={locality} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-3 text-xs font-semibold text-zinc-900 sm:p-5 sm:text-sm">{locality}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {agents.length > 0 ? (
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {agents.map((agent) => (
              <div key={agent.id} className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-soft sm:p-6">
                <p className="text-sm font-semibold text-zinc-900">{agent.name}</p>
                <p className="mt-2 text-sm text-zinc-600">{agent.area_specialization.join(', ')}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-600">{agent.bio}</p>
                <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-brand-600 px-5 text-sm font-semibold text-white transition hover:bg-brand-700">
                  Chat on WhatsApp
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2.5rem] bg-white p-6 text-center shadow-soft sm:p-8 lg:p-14">
            <p className="text-zinc-600">No agents available yet.</p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl rounded-[2.5rem] bg-gradient-to-r from-emerald-50 via-white to-zinc-50 p-6 shadow-soft sm:p-8 lg:p-14">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Trusted by Hyderabad buyers</p>
            <h2 className="mt-3 text-2xl font-semibold text-zinc-950 sm:text-3xl">A modern property search experience with local insight.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 sm:text-base">Every listing is agent-verified and curated for buyers who want a premium, clutter-free search experience.</p>
          </div>
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
              <p className="text-2xl font-semibold text-zinc-950 sm:text-3xl lg:text-4xl">98%</p>
              <p className="mt-2 text-sm text-zinc-600">Verified properties</p>
            </div>
            <div className="rounded-[2rem] bg-white p-5 shadow-soft sm:p-6">
              <p className="text-2xl font-semibold text-zinc-950 sm:text-3xl lg:text-4xl">5</p>
              <p className="mt-2 text-sm text-zinc-600">Dedicated advisors</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <StatsSection />
      </section>

      <section className="mx-auto max-w-7xl rounded-[2.5rem] bg-white p-6 text-center shadow-soft sm:p-8 lg:p-14">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">Ready to find your Hyderabad home?</p>
        <h2 className="mt-4 text-2xl font-semibold text-zinc-950 sm:text-3xl lg:text-4xl">Start your curated property journey with trusted local agents.</h2>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/properties" className="inline-flex h-14 items-center justify-center rounded-full bg-zinc-900 px-8 text-sm font-semibold text-white transition hover:bg-zinc-800">
            Browse all listings
          </Link>
          <Link href="/dashboard/agent" className="inline-flex h-14 items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50">
            Agent dashboard
          </Link>
        </div>
      </section>

      <WhatsAppButton phone="+919000000000" message="Hello HydPropertyHub, I want property assistance in Hyderabad." />
    </div>
  );
}
