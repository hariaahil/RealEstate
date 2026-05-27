import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getContactUnlocks } from '@/services/rentalService';
import Link from 'next/link';
import { RecentlyViewed } from '@/components/recently-viewed';
import { ProfileDetailsForm } from '@/components/profile-details-form';

export default async function UserDashboardPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();

  if (!session?.data.session) {
    redirect('/login');
  }

  const userId = session.data.session.user.id;
  const userEmail = session.data.session.user.email ?? 'Not available';
  const fullName = (session.data.session.user.user_metadata?.full_name as string | undefined) ?? '';
  const unlocks = await getContactUnlocks(userId);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-8">
      <div className="space-y-8">
        <div className="rounded-[3rem] bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">User dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Manage your favorites and unlocked contacts.</h1>
            </div>
            <Link href="/properties" className="inline-flex items-center rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium">Browse Properties</Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Unlocked Contacts</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{unlocks.length}</p>
            <p className="mt-2 text-sm text-zinc-600">Properties you have unlocked</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Account Type</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">Buyer</p>
            <p className="mt-2 text-sm text-zinc-600">Looking for properties</p>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Profile Details</p>
          <p className="mt-4 text-sm text-zinc-600">Email: <span className="font-medium text-zinc-900">{userEmail}</span></p>
          <ProfileDetailsForm initialName={fullName} />
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-zinc-950">Recently Unlocked Properties</h2>
          {unlocks.length > 0 ? (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {unlocks.map((unlock) => (
                <div key={unlock.id} className="rounded-2xl border border-zinc-200 p-4">
                  <p className="text-sm text-zinc-600">Property ID: {unlock.property_id}</p>
                  <p className="mt-2 text-sm font-medium text-zinc-900">Unlocked on: {new Date(unlock.unlocked_at).toLocaleDateString()}</p>
                  <p className="mt-1 text-sm text-zinc-500">Amount: ₹{unlock.amount_paid}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-zinc-600">You haven't unlocked any contacts yet.</p>
          )}
        </div>

        <RecentlyViewed />
      </div>
    </div>
  );
}
