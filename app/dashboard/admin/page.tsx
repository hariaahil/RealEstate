import { sampleAgents, sampleProperties, sampleInquiries } from '@/lib/sampleData';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
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
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{sampleAgents.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Active listings</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{sampleProperties.length}</p>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">Leads</p>
            <p className="mt-4 text-4xl font-semibold text-zinc-950">{sampleInquiries.length}</p>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Approval queue</p>
              <h2 className="mt-3 text-2xl font-semibold text-zinc-950">Pending property submissions</h2>
            </div>
            <Button variant="ghost" size="sm">Manage agents</Button>
          </div>
          <div className="mt-8 space-y-4">
            {sampleProperties.slice(0, 3).map((property) => (
              <div key={property.id} className="rounded-3xl border border-zinc-200 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-zinc-900">{property.title}</p>
                    <p className="text-sm text-zinc-500">{property.locality} • {property.property_type}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">Reject</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
