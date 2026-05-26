import { getProperties } from '@/services/propertyService';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.hydpropertieshub.com';
  const properties = await getProperties();

  const staticPages = ['', '/properties', '/dashboard/agent', '/dashboard/admin'];
  const propertyPages = properties.map((property) => `/properties/${property.locality.toLowerCase().replace(/\s+/g, '-')}/${property.slug}`);

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date().toISOString(),
    })),
    ...propertyPages.map((url) => ({
      url: `${baseUrl}${url}`,
      lastModified: new Date().toISOString(),
    })),
  ];
}
