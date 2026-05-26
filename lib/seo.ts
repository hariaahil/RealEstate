export function buildOpenGraph(title: string, description: string, path = '/') {
  return {
    title,
    description,
    url: `https://www.hydpropertieshub.com${path}`,
    images: [
      {
        url: 'https://res.cloudinary.com/demo/image/upload/v1690000000/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'HydPropertiesHub Premium Hyderabad Properties',
      },
    ],
    siteName: 'HydPropertiesHub',
    type: 'website',
  };
}

export function buildJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'HydPropertiesHub',
    url: 'https://www.hydpropertieshub.com',
    logo: 'https://www.hydpropertieshub.com/logo.png',
    description: 'Verified Hyderabad Properties from trusted agents and premium listings.',
    telephone: '+91 90000 00000',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      addressCountry: 'IN',
    },
  };
}
