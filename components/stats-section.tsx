export function StatsSection() {
  return (
    <section className="grid gap-6 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-soft sm:grid-cols-3">
      <div className="space-y-3">
        <p className="text-4xl font-semibold text-zinc-950">5</p>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Trusted agents</p>
      </div>
      <div className="space-y-3">
        <p className="text-4xl font-semibold text-zinc-950">120+</p>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Verified listings</p>
      </div>
      <div className="space-y-3">
        <p className="text-4xl font-semibold text-zinc-950">4.9/5</p>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Client satisfaction</p>
      </div>
    </section>
  );
}
