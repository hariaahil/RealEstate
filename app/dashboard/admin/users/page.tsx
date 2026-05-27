import { requireRole } from '@/lib/authz';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  await requireRole(['admin']);
  return <div className='mx-auto max-w-7xl px-6 py-10'><h1 className='text-3xl font-semibold'>User Management</h1><p className='mt-2 text-zinc-600'>Manage customers, agents, and admins from one place.</p></div>;
}
