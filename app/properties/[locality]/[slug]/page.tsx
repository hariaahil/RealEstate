import Image from 'next/image';
import { InquiryForm } from '@/components/inquiry-form';
import { PropertyCard } from '@/components/property-card';
import { PropertyGallery } from '@/components/property-gallery';
import { FavoriteButton } from '@/components/favorite-button';
import { RecentlyViewed } from '@/components/recently-viewed';
import { InPagePushAd } from '@/components/ads/InPagePushAd';
import { getPropertyBySlug, getPropertyImages, getPropertyVideos, getSimilarProperties } from '@/services/propertyService';
import { getAgents } from '@/services/agentService';
import type { Property, Agent, PropertyImage, PropertyVideo } from '@/types';

export default async function PropertyDetailsPage({ params }: any) {
  const resolvedParams = await params;
  const property = await getPropertyBySlug(resolvedParams.slug);
  
  if (!property) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-6 py-20 text-center text-zinc-700">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-950">Property not found</h1>
          <p className="mt-4">Please return to the listings page to view other premium Hyderabad homes.</p>
        </div>
      </div>
    );
  }

  const agents = await getAgents();
  const agent = agents.find((item) => item.id === property.agent_id);
  const images = await getPropertyImages(property.id);
  const videos = await getPropertyVideos(property.id);
  const similarProperties = await getSimilarProperties(property);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const currentProperty = {
    id: property.id,
    title: property.title,
    locality: property.locality,
    city: property.city,
    slug: property.slug,
    image_url: images[0]?.image_url,
    price: property.price,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-10">
          <div className="space-y-4 rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600">{property.locality}</p>
                <h1 className="mt-2 text-2xl font-semibold text-zinc-950 sm:text-3xl lg:text-4xl">{property.title}</h1>
                <div className="mt-4 flex flex-wrap gap-3">
                  <FavoriteButton propertyId={property.id} />
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out this property: ${property.title} in ${property.locality}. View it here: ${appUrl}/properties/${property.locality.toLowerCase().replace(/\s+/g, '-')}/${property.slug}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-xs sm:h-12 sm:text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
                  >
                    Share listing
                  </a>
                </div>
              </div>
              <div className="w-fit rounded-3xl bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-800">{property.property_type}</div>
            </div>
            <div className="grid gap-4 rounded-[2rem] border border-zinc-200 p-5 sm:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-zinc-500">Price</p>
                <p className="text-lg font-semibold text-zinc-900">₹{property.price.toLocaleString('en-IN')}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-zinc-500">Size</p>
                <p className="text-lg font-semibold text-zinc-900">{property.sqft} sqft</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-zinc-500">Bedrooms</p>
                <p className="text-lg font-semibold text-zinc-900">{property.bhk} BHK</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
            <div className="space-y-6">
              <div className="rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8">
                <PropertyGallery images={images} />
              </div>

              {/* In-page push ad below gallery */}
              <InPagePushAd placement="property-detail-below-gallery" className="px-0" />

              <div className="rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8">
                <h2 className="text-xl font-semibold text-zinc-950 sm:text-2xl">Property details</h2>
                <p className="mt-4 text-zinc-600">{property.description}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8">
                <h2 className="text-xl font-semibold text-zinc-950 sm:text-2xl">Nearby landmarks</h2>
                <ul className="mt-5 space-y-3 text-sm text-zinc-600">
                  <li>• Premium workspaces at Hitech City</li>
                  <li>• Top schools and curated retail</li>
                  <li>• Direct access to Hyderabad Metro</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[2.5rem] bg-white p-6 sm:p-8 text-zinc-950 shadow-soft">
                <h3 className="text-lg font-semibold sm:text-xl">Assigned advisor</h3>
                {agent ? (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-3xl bg-zinc-100">
                        <Image src={agent.profile_image} alt={agent.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold">{agent.name}</p>
                        <p className="text-sm text-zinc-600 break-words">{agent.area_specialization.join(', ')}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-zinc-600">{agent.bio}</p>
                            <div className="grid gap-3">
                        <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 text-xs sm:h-12 sm:text-sm font-semibold text-white transition hover:bg-emerald-700">
                          WhatsApp agent
                        </a>
                        <a href={`tel:${agent.phone}`} className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs sm:h-12 sm:text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">
                          Call agent
                        </a>
                      </div>
                    </div>
                  ) : (
                  <p className="text-sm text-zinc-600">Agent information not available.</p>
                )}
              </div>

              <InquiryForm propertyId={property.id} agentId={property.agent_id} />
              {/* In-page push ad below inquiry */}
              <InPagePushAd placement="property-detail-below-inquiry" className="px-0" />
              <RecentlyViewed current={currentProperty} />
            </div>
          </div>

          {videos.length > 0 && (
            <div className="rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8">
              <h2 className="text-xl font-semibold text-zinc-950 sm:text-2xl">Video walkthrough</h2>
              <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-zinc-200">
                <iframe src={videos[0].video_url} title="Video walkthrough" className="h-64 sm:h-80 w-full" />
              </div>
            </div>
          )}
        </div>

        {similarProperties.length > 0 && (
          <div className="rounded-[2.5rem] bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Similar properties</p>
                <h2 className="mt-3 text-2xl font-semibold text-zinc-950">You may also like</h2>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-1">
              {await Promise.all(similarProperties.map(async (property) => {
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
              }))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
