import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getProperties } from '@/services/propertyService';
import { getUserRoleFromSession } from '@/lib/auth';

export default async function AdminPropertiesPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();
  if (!session?.data.session || await getUserRoleFromSession(session.data.session) !== 'admin') redirect('/login');
  const properties = await getProperties();
  return <div className='mx-auto max-w-7xl px-6 py-10'><h1 className='text-3xl font-semibold'>All Listings</h1><p className='mt-2 text-zinc-600'>{properties.length} total properties</p></div>;
}
