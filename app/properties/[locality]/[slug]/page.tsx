import Image from 'next/image';
import { sampleProperties, sampleAgents, samplePropertyImages, samplePropertyVideos } from '@/lib/sampleData';
import { InquiryForm } from '@/components/inquiry-form';
import { Button } from '@/components/ui/button';
import { PropertyGallery } from '@/components/property-gallery';

export default async function PropertyDetailsPage({ params }: any) {
  const resolvedParams = await params;
  const property = sampleProperties.find((item) => item.slug === resolvedParams.slug);
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

  const agent = sampleAgents.find((item) => item.id === property.agent_id);
  const images = samplePropertyImages.filter((image) => image.property_id === property.id);
  const videos = samplePropertyVideos.filter((video) => video.property_id === property.id);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-10">
          <div className="space-y-4 rounded-[2.5rem] bg-white p-8 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600">{property.locality}</p>
                <h1 className="mt-2 text-4xl font-semibold text-zinc-950">{property.title}</h1>
              </div>
              <div className="rounded-3xl bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-800">{property.property_type}</div>
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
              <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
                <PropertyGallery images={images} />
              </div>

              <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
                <h2 className="text-2xl font-semibold text-zinc-950">Property details</h2>
                <p className="mt-4 text-zinc-600">{property.description}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
                <h2 className="text-2xl font-semibold text-zinc-950">Nearby landmarks</h2>
                <ul className="mt-5 space-y-3 text-sm text-zinc-600">
                  <li>• Premium workspaces at Hitech City</li>
                  <li>• Top schools and curated retail</li>
                  <li>• Direct access to Hyderabad Metro</li>
                </ul>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[2.5rem] bg-white p-8 text-zinc-950 shadow-soft">
                <h3 className="text-xl font-semibold">Assigned advisor</h3>
                {agent ? (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-3xl bg-zinc-100">
                        <Image src={agent.profile_image} alt={agent.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold">{agent.name}</p>
                        <p className="text-sm text-zinc-600">{agent.area_specialization.join(', ')}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-6 text-zinc-600">{agent.bio}</p>
                    <div className="grid gap-3">
                      <a href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700">
                        WhatsApp agent
                      </a>
                      <a href={`tel:${agent.phone}`} className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">
                        Call agent
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-600">Agent information not available.</p>
                )}
              </div>

              <InquiryForm propertyId={property.id} agentId={property.agent_id} />
            </div>
          </div>

          {videos.length > 0 && (
            <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
              <h2 className="text-2xl font-semibold text-zinc-950">Video walkthrough</h2>
              <div className="mt-6 overflow-hidden rounded-[1.8rem] border border-zinc-200">
                <iframe src={videos[0].video_url} title="Video walkthrough" className="h-96 w-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
