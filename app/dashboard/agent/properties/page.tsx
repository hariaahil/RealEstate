import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getProperties } from '@/services/propertyService';

export default async function AgentPropertiesPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();
  if (!session?.data.session || session.data.session.user.app_metadata?.role !== 'agent') redirect('/login');
  const properties = await getProperties();
  const mine = properties.filter((p) => p.agent_id === session.data.session?.user.id);
  return <div className='mx-auto max-w-7xl px-6 py-10'><h1 className='text-3xl font-semibold'>My Properties</h1><p className='mt-2 text-zinc-600'>{mine.length} listings owned by you.</p></div>;
}
