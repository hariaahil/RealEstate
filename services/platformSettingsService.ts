import { isSupabaseClientConfigured, supabaseClient } from '@/lib/supabaseClient';
import type { PlatformSettings } from '@/types';

const defaultSettings: Omit<PlatformSettings, 'id' | 'created_at'> = {
  enable_google_login: true,
  enable_otp_login: true,
  enable_email_login: true,
  enable_customer_signup: true,
  enable_agent_signup: false,
  maintenance_mode: false,
};

export async function getPlatformSettings(): Promise<PlatformSettings> {
  if (!isSupabaseClientConfigured) {
    return { id: 'local-default', created_at: new Date().toISOString(), ...defaultSettings };
  }

  const { data } = await supabaseClient!
    .from('platform_settings')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return { id: 'fallback-default', created_at: new Date().toISOString(), ...defaultSettings };
  }

  return data as PlatformSettings;
}

export async function updatePlatformSettings(payload: Partial<PlatformSettings>) {
  if (!isSupabaseClientConfigured) {
    return { id: 'local-default', created_at: new Date().toISOString(), ...defaultSettings, ...payload } as PlatformSettings;
  }

  const current = await getPlatformSettings();

  if (current.id.startsWith('fallback-')) {
    const { data, error } = await supabaseClient!
      .from('platform_settings')
      .insert([{ ...defaultSettings, ...payload }])
      .select('*')
      .single();
    if (error || !data) return null;
    return data as PlatformSettings;
  }

  const { data, error } = await supabaseClient!
    .from('platform_settings')
    .update(payload)
    .eq('id', current.id)
    .select('*')
    .single();

  if (error || !data) return null;
  return data as PlatformSettings;
}
