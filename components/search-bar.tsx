'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function SearchBar({ className, initialCategory = 'sale' }: { className?: string; initialCategory?: 'sale' | 'rent' }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);

  return (
    <div className={cn('rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-soft', className)}>
      <form className="grid gap-3 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
        <Input placeholder="Search by locality" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value as 'sale' | 'rent')}
          className="rounded-full border border-zinc-200 px-4 text-sm"
        >
          <option value="sale">Buy</option>
          <option value="rent">Rent</option>
        </select>
        <Input placeholder="Budget" value="10L - 2Cr" readOnly />
        <Button type="submit" variant="secondary">Search</Button>
      </form>
    </div>
  );
}
