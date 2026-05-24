'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FilterSidebar() {
  return (
    <aside className="space-y-5 rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-soft">
      <div>
        <p className="text-sm font-semibold text-zinc-900">Filter Listings</p>
        <p className="mt-2 text-sm text-zinc-600">Tailor search by locality, budget and size.</p>
      </div>
      <div className="space-y-4">
        <Input placeholder="Search keyword" />
        <Input placeholder="Locality" />
        <Input placeholder="Min price" />
        <Input placeholder="Max price" />
        <Input placeholder="BHK" />
        <Input placeholder="Furnishing" />
        <Input placeholder="Parking" />
      </div>
      <Button type="button" className="w-full">Apply filters</Button>
    </aside>
  );
}
