import { requireRole } from '@/lib/authz';
import { redirect } from 'next/navigation';
import { getProperties } from '@/services/propertyService';

export default async function AdminPropertiesPage() {
  await requireRole(['admin']);
  const properties = await getProperties();
  return <div className='mx-auto max-w-7xl px-6 py-10'><h1 className='text-3xl font-semibold'>All Listings</h1><p className='mt-2 text-zinc-600'>{properties.length} total properties</p></div>;
}
