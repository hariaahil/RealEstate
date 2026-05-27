import { requireRole } from '@/lib/authz';
import { redirect } from 'next/navigation';
import { getAgents } from '@/services/agentService';
import { AgentApprovalControl } from '@/components/admin/agent-approval-control';
import Link from 'next/link';

export default async function AdminAgentsPage() {

  if (!session?.data.session) {
    redirect('/login');
  }

  const userRole = session.data.session.user.app_metadata?.role as string | undefined;
  if (userRole !== 'admin') {
    redirect('/login');
  }

  const agents = await getAgents();

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-10 lg:px-8">
      <div className="space-y-8">
        <div className="rounded-[3rem] bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Agent applications</p>
              <h1 className="mt-3 text-4xl font-semibold text-zinc-950">Review and approve agent applications.</h1>
            </div>
            <Link className="inline-flex h-11 items-center rounded-full border border-zinc-200 px-5 text-sm font-medium" href="/dashboard/admin">Return to dashboard</Link>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-semibold text-zinc-950">Pending applications</h2>
          <p className="mt-2 text-sm text-zinc-600">Approve verified agents to publish listings and manage leads.</p>

          <div className="mt-6 space-y-4">
            {agents.length === 0 ? (
              <p className="text-sm text-zinc-600">No agent applications yet.</p>
            ) : (
              agents.map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-zinc-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-zinc-900">{agent.name}</p>
                      <p className="text-sm text-zinc-600">{agent.email} • {agent.phone}</p>
                      <p className="mt-2 text-sm text-zinc-600">Areas: {agent.area_specialization?.join(', ')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <AgentApprovalControl agent={agent} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
