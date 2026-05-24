import Image from 'next/image';
import { Button } from '@/components/ui/button';
import type { Agent } from '@/types';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-soft">
      <div className="relative h-72 w-full overflow-hidden bg-zinc-100">
        <Image src={agent.profile_image} alt={agent.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{agent.name}</p>
          <p className="text-sm text-zinc-500">{agent.area_specialization.join(', ')}</p>
        </div>
        <p className="text-sm leading-6 text-zinc-600">{agent.bio}</p>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Message on WhatsApp
          </a>
          <a
            href={`mailto:${agent.email}`}
            className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100"
          >
            Email advisor
          </a>
        </div>
      </div>
    </div>
  );
}
