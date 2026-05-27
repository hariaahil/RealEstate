import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getPlatformSettings } from '@/services/platformSettingsService';
import { AuthSettingsForm } from '@/components/admin/auth-settings-form';
import { getUserRole } from '@/lib/auth';

export default async function AdminSettingsPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();
  if (!session?.data.session || getUserRole(session.data.session.user) !== 'admin') redirect('/login');
  const settings = await getPlatformSettings();
  return <AuthSettingsForm initialSettings={settings} />;
}
