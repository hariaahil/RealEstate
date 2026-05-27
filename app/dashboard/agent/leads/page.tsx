import { requireRole } from '@/lib/authz';
import { redirect } from 'next/navigation';
import { getInquiries } from '@/services/inquiryService';

export default async function AgentLeadsPage() {
  const auth = await requireRole(['agent']);
  const leads = await getInquiries(auth.userId);
  return <div className='mx-auto max-w-7xl px-6 py-10'><h1 className='text-3xl font-semibold'>Lead Management</h1><p className='mt-2 text-zinc-600'>{leads.length} inquiries assigned to you.</p></div>;
}
