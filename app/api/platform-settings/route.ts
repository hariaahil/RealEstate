import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getPlatformSettings, updatePlatformSettings } from '@/services/platformSettingsService';
import { getUserRoleFromSession } from '@/lib/auth';

async function ensureAdmin() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();
  if (!session?.data.session) return false;
  const role = await getUserRoleFromSession(session.data.session);
  return role === 'admin';
}

export async function GET() {
  const settings = await getPlatformSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const payload = await request.json();
  const updated = await updatePlatformSettings(payload);
  if (!updated) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json(updated);
}
