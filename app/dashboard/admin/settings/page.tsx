import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getPlatformSettings } from '@/services/settingsService';
import { PlatformSettingsForm } from '@/components/admin/platform-settings-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminSettingsPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();

  if (!session?.data.session) {
    redirect('/login');
  }

  const userRole = session.data.session.user.app_metadata?.role as string | undefined;
  if (userRole !== 'admin') {
    redirect('/login');
  }

  const settings = await getPlatformSettings();

  if (!settings) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-soft">
          <h1 className="text-3xl font-semibold text-zinc-950">Unable to load settings</h1>
          <p className="mt-4 text-zinc-600">There was an issue loading platform settings. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-8">
      <div className="space-y-8">
        <div className="rounded-[3rem] bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Admin settings</p>
              <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Control authentication and maintenance mode.</h1>
            </div>
            <Link href="/dashboard/admin" className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50">
              Return to dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-zinc-950">Platform login settings</h2>
          <p className="mt-2 text-sm text-zinc-600">Toggle the sign-in methods and agent application flow used across HydPropertiesHub.</p>
          <div className="mt-8">
            <PlatformSettingsForm settings={settings} />
          </div>
        </div>
      </div>
    </div>
  );
}
