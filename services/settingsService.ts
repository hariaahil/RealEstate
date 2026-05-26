import { supabaseClient } from '@/lib/supabaseClient';
import type { PlatformSettings } from '@/types';

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getPlatformSettings(): Promise<PlatformSettings | null> {
  if (!isSupabaseConfigured()) {
    return {
      id: 'default-settings',
      enable_google_login: true,
      enable_otp_login: true,
      enable_email_login: true,
      enable_customer_signup: true,
      enable_agent_signup: false,
      maintenance_mode: false,
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabaseClient!
    .from('platform_settings')
    .select('*')
    .limit(1)
    .single();

  if (error || !data) {
    console.error('Error fetching platform settings:', error);
    return null;
  }

  return data as PlatformSettings;
}

export async function updatePlatformSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const { id, ...updatePayload } = settings;
  const query = supabaseClient!.from('platform_settings').update(updatePayload);

  if (id) {
    query.eq('id', id);
  }

  const { data, error } = await query.select().single();
  if (error || !data) {
    console.error('Error updating platform settings:', error);
    return null;
  }

  return data as PlatformSettings;
}
