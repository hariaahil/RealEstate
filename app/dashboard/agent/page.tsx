import { requireRole } from '@/lib/authz';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getInquiries } from '@/services/inquiryService';
import { getProperties } from '@/services/propertyService';
import { Button } from '@/components/ui/button';
import { InquiryStatusControl } from '@/components/inquiry/inquiry-status-control';

export default async function AgentDashboardPage() {

  if (!session?.data.session) {
    redirect('/login');
  }

  const userRole = session.data.session.user.app_metadata?.role as string | undefined;
  if (userRole !== 'agent') {
    redirect('/dashboard/admin');
  }

  const agentId = auth.userId;
  const allProperties = await getProperties();
  const agentProperties = allProperties.filter((property) => property.agent_id === agentId);
  const agentLeads = await getInquiries(agentId);

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-8">
      <div className="space-y-8">
        <div className="rounded-[3rem] bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Agent dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Manage your Hyderabad listings and leads.</h1>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard/agent/new" className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50">
                New property
              </Link>
              <Link href="/properties" className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50">
                View live listings
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Active listings</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{agentProperties.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">New inquiries</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{agentLeads.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Conversion rate</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">82%</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Role and responsibilities</p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-950">What you can manage as an agent</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="font-semibold text-zinc-900">Listings</p>
              <p className="mt-2 text-sm text-zinc-600">Create and edit your properties, pricing, media, and status.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="font-semibold text-zinc-900">Leads</p>
              <p className="mt-2 text-sm text-zinc-600">Track new inquiries, update inquiry status, and follow up quickly.</p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-5">
              <p className="font-semibold text-zinc-900">Performance</p>
              <p className="mt-2 text-sm text-zinc-600">Monitor active listings and improve conversion with timely updates.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Your listings</p>
                <h2 className="mt-3 text-2xl font-semibold text-zinc-950">Active properties</h2>
              </div>
              <p className="text-sm text-zinc-500">Sorted by latest</p>
            </div>
            <div className="mt-8 space-y-4">
              {agentProperties.map((property) => (
                <div key={property.id} className="rounded-3xl border border-zinc-200 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-zinc-900">{property.title}</p>
                      <p className="text-sm text-zinc-500">{property.locality} • {property.bhk} BHK</p>
                    </div>
                    <div className="space-x-2 text-sm text-zinc-600">
                      <span>{property.status}</span>
                      <span>₹{property.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Leads</p>
                <h2 className="mt-3 text-2xl font-semibold text-zinc-950">Recent inquiries</h2>
              </div>
              <Button variant="ghost" size="sm">View all</Button>
            </div>
            <div className="mt-8 space-y-4">
              {agentLeads.map((inquiry) => (
                <div key={inquiry.id} className="rounded-3xl border border-zinc-200 p-4">
                  <p className="font-semibold text-zinc-900">{inquiry.buyer_name}</p>
                  <p className="text-sm text-zinc-600">{inquiry.message}</p>
                  <p className="mt-2 text-sm text-zinc-500">{inquiry.buyer_phone} • {inquiry.inquiry_status}</p>
                  <InquiryStatusControl inquiry={inquiry} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
