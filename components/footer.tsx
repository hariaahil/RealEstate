import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const areas = ['Gachibowli', 'Kondapur', 'Madhapur', 'Miyapur', 'Kukatpally', 'Financial District', 'Hitech City'];

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <div>
          <div className="mb-4">
            <Image src="/logo.svg" alt="HydPropertiesHub logo" width={230} height={58} className="h-auto w-[230px] max-w-full" />
          </div>
          <p className="max-w-lg leading-7 text-zinc-400">
            A premium Hyderabad property platform offering verified listings and dedicated agent-led assistance for discerning buyers.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {areas.slice(0, 5).map((area) => (
              <Badge key={area} variant="outline" className="text-xs">{area}</Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Resources</h3>
            <ul className="space-y-2 text-sm text-zinc-300">
              <li><Link href="/properties" className="transition hover:text-white">Property search</Link></li>
              <li><Link href="/dashboard/agent" className="transition hover:text-white">Agent dashboard</Link></li>
              <li><Link href="/dashboard/admin" className="transition hover:text-white">Admin dashboard</Link></li>
              <li><Link href="/" className="transition hover:text-white">Why choose us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">Contact</h3>
            <p className="text-sm text-zinc-300">hello@hydpropertieshub.com</p>
            <p className="mt-2 text-sm text-zinc-300">+91 90000 00000</p>
            <p className="mt-2 text-sm text-zinc-300">Hyderabad, Telangana</p>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800 px-6 py-6 text-center text-sm text-zinc-500 lg:px-8">
        © {new Date().getFullYear()} HydPropertiesHub. All rights reserved.
      </div>
    </footer>
  );
}
