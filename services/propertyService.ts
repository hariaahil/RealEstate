import { supabaseClient } from '@/lib/supabaseClient';
import { sampleProperties, samplePropertyImages, samplePropertyVideos } from '@/lib/sampleData';
import type { Property, PropertyImage, PropertyVideo } from '@/types';

export async function getProperties(): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return sampleProperties;
  }

  const { data, error } = await supabaseClient!
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return sampleProperties;
  }

  return data as Property[];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return sampleProperties.find((property) => property.slug === slug) ?? null;
  }

  const { data, error } = await supabaseClient!
    .from('properties')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Property;
}

export async function getPropertiesByLocality(locality: string): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return sampleProperties.filter((property) => property.locality.toLowerCase() === locality.toLowerCase());
  }

  const { data, error } = await supabaseClient!
    .from('properties')
    .select('*')
    .eq('locality', locality)
    .order('price', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as Property[];
}

export async function getFeaturedProperties(): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return sampleProperties.filter((property) => property.featured && property.status === 'approved');
  }

  const { data, error } = await supabaseClient!
    .from('properties')
    .select('*')
    .eq('featured', true)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return sampleProperties.filter((property) => property.featured && property.status === 'approved');
  }

  return data as Property[];
}

export async function getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return samplePropertyImages.filter((image) => image.property_id === propertyId);
  }

  const { data, error } = await supabaseClient!
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId)
    .order('id', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as PropertyImage[];
}

export async function getPropertyVideos(propertyId: string): Promise<PropertyVideo[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return samplePropertyVideos.filter((video) => video.property_id === propertyId);
  }

  const { data, error } = await supabaseClient!
    .from('property_videos')
    .select('*')
    .eq('property_id', propertyId)
    .order('id', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as PropertyVideo[];
}
