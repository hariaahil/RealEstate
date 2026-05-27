import { getCurrentUserRole } from '@/lib/authz';
import { NextResponse } from 'next/server';
import { getPlatformSettings, updatePlatformSettings } from '@/services/platformSettingsService';

async function ensureAdmin() { const auth = await getCurrentUserRole(); return auth?.role === 'admin'; }

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
