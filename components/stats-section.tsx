type StatsSectionProps = {
  trustedAgents: number;
  verifiedListings: number;
};

export function StatsSection({ trustedAgents, verifiedListings }: StatsSectionProps) {
  return (
    <section className="grid gap-6 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-soft sm:grid-cols-2">
      <div className="space-y-3">
        <p className="text-4xl font-semibold text-zinc-950">{trustedAgents}</p>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Trusted agents</p>
      </div>
      <div className="space-y-3">
        <p className="text-4xl font-semibold text-zinc-950">{verifiedListings}</p>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Verified listings</p>
      </div>
    </section>
  );
}
