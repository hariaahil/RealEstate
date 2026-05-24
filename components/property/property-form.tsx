'use client';

import { FormEvent, ChangeEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Property } from '@/types';

const CLOUDINARY_URL = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  ? `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`
  : undefined;

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

async function uploadImage(file: File) {
  if (!CLOUDINARY_URL || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured correctly.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message || 'Cloudinary upload failed.');
  }

  return result.secure_url as string;
}

function buildFormState(property?: Property) {
  return {
    title: property?.title ?? '',
    description: property?.description ?? '',
    price: property?.price.toString() ?? '0',
    property_type: property?.property_type ?? 'Apartment',
    bhk: property?.bhk.toString() ?? '1',
    sqft: property?.sqft.toString() ?? '0',
    locality: property?.locality ?? '',
    city: property?.city ?? 'Hyderabad',
    address_approx: property?.address_approx ?? '',
    furnishing: property?.furnishing ?? 'Semi-Furnished',
    parking: property?.parking.toString() ?? '1',
  };
}

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const [supabase] = useState(() => createBrowserSupabaseClient());
  const defaultState = useMemo(() => buildFormState(property), [property]);
  const [formValues, setFormValues] = useState(defaultState);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof defaultState, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files ? Array.from(event.target.files) : []);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        router.push('/login');
        return;
      }

      const agentId = session.data.session.user.id;
      const slug = slugify(formValues.title || `${Date.now()}`);
      const body = {
        title: formValues.title,
        description: formValues.description,
        price: Number(formValues.price),
        property_type: formValues.property_type,
        bhk: Number(formValues.bhk),
        sqft: Number(formValues.sqft),
        locality: formValues.locality,
        city: formValues.city,
        address_approx: formValues.address_approx,
        amenities: [],
        latitude: 17.385, // placeholder Hyderabad coordinates
        longitude: 78.4867,
        featured: false,
        verified: false,
        status: 'pending',
        agent_id: agentId,
        furnishing: formValues.furnishing,
        parking: Number(formValues.parking),
        slug,
      } as const;

      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await Promise.all(selectedFiles.map((file) => uploadImage(file)));
      }

      if (property) {
        await supabase.from('properties').update(body).eq('id', property.id);
        if (imageUrls.length > 0) {
          await supabase.from('property_images').insert(
            imageUrls.map((url) => ({ property_id: property.id, image_url: url }))
          );
        }
      } else {
        const { data, error } = await supabase.from('properties').insert([{ ...body }]).select().single();
        if (error || !data) {
          throw new Error(error?.message || 'Unable to create property.');
        }
        if (imageUrls.length > 0) {
          await supabase.from('property_images').insert(
            imageUrls.map((url) => ({ property_id: data.id, image_url: url }))
          );
        }
      }

      router.push('/dashboard/agent');
    } catch (error: any) {
      setMessage(error?.message ?? 'Failed to submit property.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] bg-white p-10 shadow-soft">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">{property ? 'Edit listing' : 'New listing'}</p>
          <h1 className="text-3xl font-semibold text-zinc-950">{property ? 'Update property details' : 'Create a new property listing'}</h1>
          <p className="text-sm text-zinc-500">Add or edit details and upload images for client-ready Hyderabad listings.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Title</span>
              <Input value={formValues.title} onChange={(event) => handleChange('title', event.target.value)} required className="mt-2" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Locality</span>
              <Input value={formValues.locality} onChange={(event) => handleChange('locality', event.target.value)} required className="mt-2" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Price</span>
              <Input type="number" value={formValues.price} onChange={(event) => handleChange('price', event.target.value)} required className="mt-2" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">City</span>
              <Input value={formValues.city} onChange={(event) => handleChange('city', event.target.value)} required className="mt-2" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Property type</span>
              <select
                value={formValues.property_type}
                onChange={(event) => handleChange('property_type', event.target.value)}
                className="mt-2 block w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option>Apartment</option>
                <option>Villa</option>
                <option>Plot</option>
                <option>Office</option>
                <option>Retail</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">Furnishing</span>
              <select
                value={formValues.furnishing}
                onChange={(event) => handleChange('furnishing', event.target.value)}
                className="mt-2 block w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option>Furnished</option>
                <option>Semi-Furnished</option>
                <option>Unfurnished</option>
              </select>
            </label>
            <div className="grid gap-6 sm:grid-cols-3">
              <label className="block">
                <span className="text-sm font-medium text-zinc-700">BHK</span>
                <Input type="number" value={formValues.bhk} onChange={(event) => handleChange('bhk', event.target.value)} required className="mt-2" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Sqft</span>
                <Input type="number" value={formValues.sqft} onChange={(event) => handleChange('sqft', event.target.value)} required className="mt-2" />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-zinc-700">Parking</span>
                <Input type="number" value={formValues.parking} onChange={(event) => handleChange('parking', event.target.value)} required className="mt-2" />
              </label>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Approximate address</span>
            <Input value={formValues.address_approx} onChange={(event) => handleChange('address_approx', event.target.value)} required className="mt-2" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Description</span>
            <Textarea value={formValues.description} onChange={(event) => handleChange('description', event.target.value)} required className="mt-2" />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Property images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-2 block w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </label>

          {selectedFiles.length > 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
              {selectedFiles.length} image(s) selected for upload.
            </div>
          ) : null}

          {message ? <p className="text-sm text-red-600">{message}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Saving property…' : property ? 'Update property' : 'Create listing'}
            </Button>
            <p className="text-xs text-zinc-500">Submissions go into review with pending approval status.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
