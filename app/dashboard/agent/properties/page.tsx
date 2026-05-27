import { requireRole } from '@/lib/authz';
import { redirect } from 'next/navigation';
import { getProperties } from '@/services/propertyService';

export default async function AgentPropertiesPage() {
  const auth = await requireRole(['agent']);
  const properties = await getProperties();
  const mine = properties.filter((p) => p.agent_id === auth.userId);
  return <div className='mx-auto max-w-7xl px-6 py-10'><h1 className='text-3xl font-semibold'>My Properties</h1><p className='mt-2 text-zinc-600'>{mine.length} listings owned by you.</p></div>;
}
