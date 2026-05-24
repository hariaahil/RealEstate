import { supabaseClient } from '@/lib/supabaseClient';
import type { Property, PropertyImage, PropertyVideo } from '@/types';

export async function getProperties(): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase URL not configured. Returning empty array.');
    return [];
  }
  
  const { data: properties, error } = await supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching properties:', error);
    return [];
  }

  // Map the first image to the property's image_url
  return properties.map((property: any) => ({
    ...property,
    image_url: property.property_images && property.property_images.length > 0 
      ? property.property_images[0].image_url 
      : undefined
  })) as Property[];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const { data: property, error } = await supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `)
    .eq('slug', slug)
    .single();

  if (error || !property) {
    return null;
  }

  // Map the first image to the property's image_url
  return {
    ...property,
    image_url: property.property_images && property.property_images.length > 0 
      ? property.property_images[0].image_url 
      : undefined
  } as Property;
}

export async function getPropertiesByLocality(locality: string): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  const { data: properties, error } = await supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `)
    .eq('locality', locality)
    .order('price', { ascending: true });

  if (error || !data) {
    return [];
  }

  // Map the first image to the property's image_url
  return properties.map((property: any) => ({
    ...property,
    image_url: property.property_images && property.property_images.length > 0 
      ? property.property_images[0].image_url 
      : undefined
  })) as Property[];
}

export async function getFeaturedProperties(): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  const { data: properties, error } = await supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `)
    .eq('featured', true)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  // Map the first image to the property's image_url
  return properties.map((property: any) => ({
    ...property,
    image_url: property.property_images && property.property_images.length > 0 
      ? property.property_images[0].image_url 
      : undefined
  })) as Property[];
}

export async function getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  const { data, error } = await supabaseClient!
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as PropertyImage[];
}

export async function getPropertyVideos(propertyId: string): Promise<PropertyVideo[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  const { data, error } = await supabaseClient!
    .from('property_videos')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as PropertyVideo[];
}
