import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getInquiries } from '@/services/inquiryService';
import { getUserRoleFromSession } from '@/lib/auth';

export default async function AgentLeadsPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();
  if (!session?.data.session) redirect('/login');
  const role = await getUserRoleFromSession(session.data.session);
  if (role !== 'agent' && role !== 'admin') redirect('/login');
  const leads = await getInquiries(role === 'admin' ? undefined : session.data.session.user.id);
  return <div className='mx-auto max-w-7xl px-6 py-10'><h1 className='text-3xl font-semibold'>Lead Management</h1><p className='mt-2 text-zinc-600'>{leads.length} inquiries assigned to you.</p></div>;
}
