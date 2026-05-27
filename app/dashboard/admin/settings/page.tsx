import { requireRole } from '@/lib/authz';
import { redirect } from 'next/navigation';
import { getPlatformSettings } from '@/services/platformSettingsService';
import { AuthSettingsForm } from '@/components/admin/auth-settings-form';

export default async function AdminSettingsPage() {
  await requireRole(['admin']);
  const settings = await getPlatformSettings();
  return <AuthSettingsForm initialSettings={settings} />;
}
