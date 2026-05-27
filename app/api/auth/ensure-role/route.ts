import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserRoleFromSession } from '@/lib/auth';

export async function POST() {
  try {
    const supabase = createServerSupabase();
    const session = await supabase?.auth.getSession();
    const user = session?.data.session?.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const hasStoredRole = Boolean(user.app_metadata?.role || user.user_metadata?.role);
    const role = await getUserRoleFromSession(session.data.session);

    if (hasStoredRole) {
      return NextResponse.json({ role, updated: false });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ role, updated: false, warning: 'Admin client not configured' });
    }

    await supabaseAdmin.auth.admin.updateUserById(user.id, {
      app_metadata: { ...(user.app_metadata ?? {}), role: 'user' },
      user_metadata: { ...(user.user_metadata ?? {}), role: 'user' },
    });

    return NextResponse.json({ role: 'user', updated: true });
  } catch (error) {
    console.error('Failed to ensure role:', error);
    return NextResponse.json({ error: 'Failed to ensure role' }, { status: 500 });
  }
}
