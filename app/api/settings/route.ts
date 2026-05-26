import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({
      id: 'default-settings',
      enable_google_login: true,
      enable_otp_login: true,
      enable_email_login: true,
      enable_customer_signup: true,
      enable_agent_signup: false,
      maintenance_mode: false,
      created_at: new Date().toISOString(),
    });
  }

  const { data, error } = await supabaseClient!
    .from('platform_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...settings } = body;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true, settings: { id: id ?? 'default-settings', ...settings } });
    }

    const { data, error } = await supabaseClient!
      .from('platform_settings')
      .update(settings)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Settings PATCH error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (error) {
    console.error('Settings PATCH failed:', error);
    return NextResponse.json({ error: 'Unable to update settings' }, { status: 500 });
  }
}
