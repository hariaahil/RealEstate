'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState('');

  return (
    <div className={cn('rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-soft', className)}>
      <form className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
        <Input placeholder="Search by locality" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Input placeholder="Property type" value="Apartment" readOnly />
        <Input placeholder="Budget" value="10L - 2Cr" readOnly />
        <Button type="submit" variant="secondary">Search</Button>
      </form>
    </div>
  );
}
