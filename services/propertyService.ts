import { supabaseClient } from '@/lib/supabaseClient';
import type { Property, PropertyImage, PropertyVideo } from '@/types';

export async function getProperties(): Promise<Property[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase URL not configured. Returning empty array.');
    return [];
  }
  
  const { data, error } = await supabaseClient!
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return data as Property[];
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
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
    return [];
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
    return [];
  }

  const { data, error } = await supabaseClient!
    .from('properties')
    .select('*')
    .eq('featured', true)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Property[];
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
