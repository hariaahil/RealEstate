import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getAgents } from '@/services/agentService';
import { getInquiries } from '@/services/inquiryService';
import { getProperties } from '@/services/propertyService';
import { Button } from '@/components/ui/button';
import { getUserRoleFromSession } from '@/lib/auth';

export default async function AdminDashboardPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();

  if (!session?.data.session) {
    redirect('/login');
  }

  const userRole = await getUserRoleFromSession(session.data.session);
  if (userRole !== 'admin') {
    redirect('/login');
  }

  const inquiries = await getInquiries();
  const agents = await getAgents();
  const properties = await getProperties();
  const counts = inquiries.reduce(
    (acc, inquiry) => ({
      ...acc,
      [inquiry.inquiry_status]: acc[inquiry.inquiry_status] + 1,
    }),
    { new: 0, contacted: 0, qualified: 0, closed: 0 }
  );

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-8">
      <div className="space-y-8">
        <div className="rounded-[3rem] bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Admin dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Review, approve and manage Hyderabad listings.</h1>
            </div>
            <Button>Approve new properties</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Agents</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{agents.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Active listings</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{properties.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Leads</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{inquiries.length}</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Role and responsibilities</p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-950">What admin can control</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="font-semibold text-zinc-900">Approvals</p>
              <p className="mt-2 text-sm text-zinc-600">Approve, reject, and moderate listings before public visibility.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="font-semibold text-zinc-900">Agent oversight</p>
              <p className="mt-2 text-sm text-zinc-600">Monitor agent activity, listing quality, and response times.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="font-semibold text-zinc-900">Lead operations</p>
              <p className="mt-2 text-sm text-zinc-600">Review funnel health and ensure leads are handled consistently.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Lead dashboard</p>
              <h2 className="mt-3 text-2xl font-semibold text-zinc-950">Lead status overview</h2>
            </div>
            <Button variant="ghost" size="sm">View all leads</Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">New</p>
              <p className="mt-4 text-3xl font-semibold text-zinc-950">{counts.new}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Contacted</p>
              <p className="mt-4 text-3xl font-semibold text-zinc-950">{counts.contacted}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Qualified</p>
              <p className="mt-4 text-3xl font-semibold text-zinc-950">{counts.qualified}</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Closed</p>
              <p className="mt-4 text-3xl font-semibold text-zinc-950">{counts.closed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
