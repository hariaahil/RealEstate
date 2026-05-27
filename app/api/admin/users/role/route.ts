import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getUserRoleFromSession } from '@/lib/auth';

const allowedRoles = new Set(['user', 'agent', 'admin']);

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    const session = await supabase?.auth.getSession();

    if (!session?.data.session || await getUserRoleFromSession(session.data.session) !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Service role client not configured' }, { status: 500 });
    }

    const body = await request.json();
    const email = String(body?.email ?? '').trim().toLowerCase();
    const role = String(body?.role ?? '').trim().toLowerCase();

    if (!email || !allowedRoles.has(role)) {
      return NextResponse.json({ error: 'Valid email and role are required' }, { status: 400 });
    }

    const listResult = await supabaseAdmin.auth.admin.listUsers({ query: email });
    const users = listResult?.data?.users ?? [];
    const targetUser = users.find((user: any) => (user.email ?? '').toLowerCase() === email);

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      app_metadata: { ...(targetUser.app_metadata ?? {}), role },
      user_metadata: { ...(targetUser.user_metadata ?? {}), role },
    });

    return NextResponse.json({ success: true, email, role });
  } catch (error) {
    console.error('Failed to update user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
