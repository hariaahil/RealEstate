import { supabaseClient } from '@/lib/supabaseClient';
import { sampleProperties, samplePropertyImages, samplePropertyVideos } from '@/lib/sampleData';
import type { Property, PropertyImage, PropertyVideo } from '@/types';

function isSupabaseConfigured() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.warn('Supabase URL not configured. Returning empty result.');
    return false;
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('Supabase anon key not configured. Returning empty result.');
    return false;
  }

  return true;
}

function normalizeProperty(property: any): Property {
  return {
    ...property,
    image_url:
      property.property_images && property.property_images.length > 0
        ? property.property_images[0].image_url
        : undefined,
  } as Property;
}

export type PropertyQuerySort = 'newest' | 'price_low_high' | 'price_high_low' | 'sqft_low_high' | 'sqft_high_low' | 'rent_low_high' | 'rent_high_low' | 'most_viewed';

export type PropertyQueryOptions = {
  page?: number;
  pageSize?: number;
  sort?: PropertyQuerySort;
  locality?: string;
  listingCategory?: 'sale' | 'rent';
  minRent?: number;
  maxRent?: number;
  depositMin?: number;
  depositMax?: number;
  furnishing?: string;
  bhk?: number;
  petsAllowed?: boolean;
  availableFrom?: string;
  bathrooms?: number;
  balcony?: number;
  tenantPreference?: string;
};

export async function getProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data: properties, error } = await supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `)
    .order('created_at', { ascending: false });

  if (error || !properties) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return properties.map(normalizeProperty);
}

export function normalizeLocality(value: string) {
  return value.trim().replace(/-/g, ' ').toLowerCase();
}

export function sortSampleProperties(properties: Property[], sort?: PropertyQuerySort) {
  return [...properties].sort((a, b) => {
    switch (sort) {
      case 'price_low_high':
        return (a.price || 0) - (b.price || 0);
      case 'price_high_low':
        return (b.price || 0) - (a.price || 0);
      case 'rent_low_high':
        return (a.monthly_rent || 0) - (b.monthly_rent || 0);
      case 'rent_high_low':
        return (b.monthly_rent || 0) - (a.monthly_rent || 0);
      case 'most_viewed':
        return (b.views || 0) - (a.views || 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
}

export async function getPropertiesPage(options: PropertyQueryOptions = {}): Promise<{ properties: Property[]; total: number }> {
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize = options.pageSize && options.pageSize > 0 ? options.pageSize : 9;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  if (!isSupabaseConfigured()) {
    let filtered = sampleProperties;

    if (options.listingCategory) {
      filtered = filtered.filter((property) => property.listing_category === options.listingCategory);
    }

    if (options.locality) {
      const normalizedLocality = normalizeLocality(options.locality);
      filtered = filtered.filter((property) => normalizeLocality(property.locality) === normalizedLocality);
    }

    if (options.bhk) {
      filtered = filtered.filter((property) => property.bhk === options.bhk);
    }

    if (options.furnishing) {
      filtered = filtered.filter((property) => property.furnishing === options.furnishing);
    }

    if (options.minRent) {
      filtered = filtered.filter((property) => (property.monthly_rent || 0) >= options.minRent!);
    }

    if (options.maxRent) {
      filtered = filtered.filter((property) => (property.monthly_rent || 0) <= options.maxRent!);
    }

    if (options.depositMin) {
      filtered = filtered.filter((property) => (property.deposit_amount || 0) >= options.depositMin!);
    }

    if (options.depositMax) {
      filtered = filtered.filter((property) => (property.deposit_amount || 0) <= options.depositMax!);
    }

    if (options.bathrooms) {
      filtered = filtered.filter((property) => property.bathrooms === options.bathrooms);
    }

    if (options.balcony) {
      filtered = filtered.filter((property) => property.balcony === options.balcony);
    }

    if (options.petsAllowed !== undefined) {
      filtered = filtered.filter((property) => property.pets_allowed === options.petsAllowed);
    }

    if (options.availableFrom) {
      filtered = filtered.filter((property) => property.available_from && property.available_from >= options.availableFrom!);
    }

    if (options.tenantPreference) {
      filtered = filtered.filter((property) => property.tenant_preference?.includes(options.tenantPreference!));
    }

    const sorted = sortSampleProperties(filtered, options.sort);
    const sliced = sorted.slice(start, end + 1);

    return { properties: sliced.map(normalizeProperty), total: filtered.length };
  }

  const query = supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `, { count: 'exact' });

  if (options.locality) {
    const normalizedLocality = options.locality.replace(/-/g, ' ');
    query.ilike('locality', normalizedLocality);
  }

  if (options.listingCategory) {
    query.eq('listing_category', options.listingCategory);
  }

  if (options.bhk) {
    query.eq('bhk', options.bhk);
  }

  if (options.furnishing) {
    query.eq('furnishing', options.furnishing);
  }

  if (options.minRent) {
    query.gte('monthly_rent', options.minRent);
  }

  if (options.maxRent) {
    query.lte('monthly_rent', options.maxRent);
  }

  if (options.depositMin) {
    query.gte('deposit_amount', options.depositMin);
  }

  if (options.depositMax) {
    query.lte('deposit_amount', options.depositMax);
  }

  if (options.bathrooms) {
    query.eq('bathrooms', options.bathrooms);
  }

  if (options.balcony) {
    query.eq('balcony', options.balcony);
  }

  if (options.petsAllowed !== undefined) {
    query.eq('pets_allowed', options.petsAllowed);
  }

  if (options.availableFrom) {
    query.gte('available_from', options.availableFrom);
  }

  if (options.tenantPreference) {
    query.cs('tenant_preference', [options.tenantPreference]);
  }

  switch (options.sort) {
    case 'price_low_high':
      query.order('price', { ascending: true });
      break;
    case 'price_high_low':
      query.order('price', { ascending: false });
      break;
    case 'sqft_low_high':
      query.order('sqft', { ascending: true });
      break;
    case 'sqft_high_low':
      query.order('sqft', { ascending: false });
      break;
    case 'rent_low_high':
      query.order('monthly_rent', { ascending: true });
      break;
    case 'rent_high_low':
      query.order('monthly_rent', { ascending: false });
      break;
    case 'most_viewed':
      query.order('views', { ascending: false });
      break;
    default:
      query.order('created_at', { ascending: false });
  }

  const { data: properties, count, error } = await query.range(start, end);
  if (error || !properties) {
    console.error('Error fetching paged properties:', error);
    return { properties: [], total: 0 };
  }

  return { properties: properties.map(normalizeProperty), total: count ?? 0 };
}

export async function getSimilarProperties(property: Property): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
    return sampleProperties
      .filter((item) => item.id !== property.id && item.status === 'approved' && item.listing_category === property.listing_category && normalizeLocality(item.locality) === normalizeLocality(property.locality))
      .slice(0, 3)
      .map(normalizeProperty);
  }

  const normalizedLocality = property.locality.replace(/-/g, ' ');

  const { data: properties, error } = await supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `)
    .ilike('locality', normalizedLocality)
    .neq('id', property.id)
    .eq('status', 'approved')
    .eq('listing_category', property.listing_category)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error || !properties) {
    console.error('Error fetching similar properties:', error);
    return [];
  }

  return properties.map(normalizeProperty);
}

export async function getPropertyById(propertyId: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data: property, error } = await supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `)
    .eq('id', propertyId)
    .single();

  if (error || !property) {
    console.error('Error fetching property by id:', error);
    return null;
  }

  return normalizeProperty(property);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) {
    const property = sampleProperties.find((item) => item.slug === slug);
    return property ? normalizeProperty(property) : null;
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
    console.error('Error fetching property by slug:', error);
    return null;
  }

  return normalizeProperty(property);
}

export async function getPropertiesByLocality(locality: string): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
    const normalizedLocality = normalizeLocality(locality);
    return sampleProperties
      .filter((item) => normalizeLocality(item.locality) === normalizedLocality)
      .sort((a, b) => (a.price || 0) - (b.price || 0))
      .map(normalizeProperty);
  }

  const normalizedLocality = locality.replace(/-/g, ' ');
  const { data: properties, error } = await supabaseClient!
    .from('properties')
    .select(`
      *,
      property_images (image_url)
    `)
    .ilike('locality', normalizedLocality)
    .order('price', { ascending: true });

  if (error || !properties) {
    console.error('Error fetching properties by locality:', error);
    return [];
  }

  return properties.map(normalizeProperty);
}

export async function getFeaturedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) {
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

  if (error || !properties) {
    console.error('Error fetching featured properties:', error);
    return [];
  }

  return properties.map(normalizeProperty);
}

export async function getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
  if (!isSupabaseConfigured()) {
    return samplePropertyImages.filter((image) => image.property_id === propertyId);
  }

  const { data, error } = await supabaseClient!
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching property images:', error);
    return [];
  }

  return data as PropertyImage[];
}

export async function getPropertyVideos(propertyId: string): Promise<PropertyVideo[]> {
  if (!isSupabaseConfigured()) {
    return samplePropertyVideos.filter((video) => video.property_id === propertyId);
  }

  const { data, error } = await supabaseClient!
    .from('property_videos')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error('Error fetching property videos:', error);
    return [];
  }

  return data as PropertyVideo[];
}

export async function createProperty(property: Partial<Property>, imageUrls: string[] = []): Promise<Property | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabaseClient!
    .from('properties')
    .insert([property])
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating property:', error);
    return null;
  }

  if (imageUrls.length > 0) {
    const { error: imagesError } = await supabaseClient!
      .from('property_images')
      .insert(imageUrls.map((url) => ({ property_id: data.id, image_url: url })));

    if (imagesError) {
      console.error('Error inserting property images:', imagesError);
    }
  }

  return normalizeProperty({ ...data, property_images: imageUrls.map((url) => ({ image_url: url })) });
}

export async function updateProperty(
  propertyId: string,
  updates: Partial<Property>,
  imageUrls: string[] = []
): Promise<Property | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { data, error } = await supabaseClient!
    .from('properties')
    .update(updates)
    .eq('id', propertyId)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating property:', error);
    return null;
  }

  if (imageUrls.length > 0) {
    const { error: imagesError } = await supabaseClient!
      .from('property_images')
      .insert(imageUrls.map((url) => ({ property_id: propertyId, image_url: url })));

    if (imagesError) {
      console.error('Error inserting additional property images:', imagesError);
    }
  }

  return normalizeProperty({ ...data, property_images: imageUrls.map((url) => ({ image_url: url })) });
}
