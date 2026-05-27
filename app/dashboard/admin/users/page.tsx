import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getUserRole } from '@/lib/auth';
import { UserRoleManager } from '@/components/admin/user-role-manager';

export default async function AdminUsersPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();
  if (!session?.data.session || getUserRole(session.data.session.user) !== 'admin') redirect('/login');
  return (
    <div className='mx-auto max-w-7xl px-6 py-10'>
      <h1 className='text-3xl font-semibold'>User Management</h1>
      <p className='mt-2 text-zinc-600'>Manage customers, agents, and admins from one place.</p>
      <UserRoleManager />
    </div>
  );
}
