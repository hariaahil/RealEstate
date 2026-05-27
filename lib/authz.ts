import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export type AppRole = 'customer' | 'agent' | 'admin';

export async function getCurrentUserRole(): Promise<{ userId: string; role: AppRole } | null> {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();
  const user = session?.data.session?.user;
  if (!user) return null;

  const adminRole = user.app_metadata?.role as AppRole | undefined;
  if (adminRole === 'admin') return { userId: user.id, role: 'admin' };

  if (supabaseAdmin) {
    const { data } = await supabaseAdmin.from('users').select('role').eq('id', user.id).maybeSingle();
    const role = (data?.role as AppRole | undefined) ?? 'customer';
    return { userId: user.id, role };
  }

  return { userId: user.id, role: 'customer' };
}

export async function requireRole(allowed: AppRole[]) {
  const auth = await getCurrentUserRole();
  if (!auth || !allowed.includes(auth.role)) redirect('/login');
  return auth;
}
