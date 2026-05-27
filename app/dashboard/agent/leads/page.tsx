import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getInquiries } from '@/services/inquiryService';

export default async function AgentLeadsPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();
  if (!session?.data.session || session.data.session.user.app_metadata?.role !== 'agent') redirect('/login');
  const leads = await getInquiries(session.data.session.user.id);
  return <div className='mx-auto max-w-7xl px-6 py-10'><h1 className='text-3xl font-semibold'>Lead Management</h1><p className='mt-2 text-zinc-600'>{leads.length} inquiries assigned to you.</p></div>;
}
