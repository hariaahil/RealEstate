import { sampleProperties } from '@/lib/sampleData';

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.hydpropertieshub.com';

  const staticPages = ['', '/properties', '/dashboard/agent', '/dashboard/admin'];
  const propertyPages = sampleProperties.map((property) => `/properties/${property.locality.toLowerCase().replace(/\s+/g, '-')}/${property.slug}`);

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
