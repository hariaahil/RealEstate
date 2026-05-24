import { twMerge } from 'tailwind-merge';
import type { Property } from '@/types';

export function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(inputs.filter(Boolean).join(' '));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function buildCloudinaryImage(path: string, width = 1200, height = 800) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    return path;
  }
  const encoded = encodeURIComponent(path.replace(/^https:\/\//, ''));
  return `https://res.cloudinary.com/${cloudName}/image/f_auto,q_auto,w_${width},h_${height},c_fill/${encoded}`;
}

export function getPropertySlug(property: Property) {
  return `/properties/${property.locality.toLowerCase().replace(/\s+/g, '-')}/${property.slug}`;
}
