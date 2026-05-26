import type { Metadata } from 'next';
import { AgentApplicationForm } from '@/components/agent/agent-application-form';

export const metadata: Metadata = {
  title: 'Apply as Agent | HydPropertiesHub',
  description: 'Submit your agent application to join HydPropertiesHub as a trusted Hyderabad property advisor.',
};

export default function AgentApplyPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-[3rem] bg-white p-10 shadow-soft lg:p-14">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Agent application</p>
          <h1 className="text-4xl font-semibold text-zinc-950 sm:text-5xl">Apply to become a HydPropertiesHub agent.</h1>
          <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
            Submit your details and we will reach out after reviewing your profile. Our admin team approves new agents manually to keep the platform premium.
          </p>
        </div>
        <AgentApplicationForm />
      </div>
    </div>
  );
}
