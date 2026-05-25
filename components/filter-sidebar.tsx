'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') ?? '');
  const [locality, setLocality] = useState(searchParams.get('locality') ?? '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') ?? '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') ?? '');
  const [bhk, setBhk] = useState(searchParams.get('bhk') ?? '');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    const updates = { keyword, locality, minPrice, maxPrice, bhk };
    Object.entries(updates).forEach(([key, value]) => {
      if (value.trim()) params.set(key, value.trim());
      else params.delete(key);
    });
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setKeyword('');
    setLocality('');
    setMinPrice('');
    setMaxPrice('');
    setBhk('');
    router.push(pathname);
    setIsOpen(false);
  };

  return (
    <aside className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-soft sm:p-6">
      <Button type="button" variant="ghost" className="w-full md:hidden" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? 'Hide filters' : 'Show filters'}
      </Button>
      <div>
        <p className="text-sm font-semibold text-zinc-900">Filter Listings</p>
        <p className="mt-2 text-sm text-zinc-600">Mobile and desktop friendly filters for faster search.</p>
      </div>
      <div className={`space-y-4 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <Input placeholder="Search keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Input placeholder="Locality" value={locality} onChange={(e) => setLocality(e.target.value)} />
        <Input placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <Input placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <Input placeholder="BHK" value={bhk} onChange={(e) => setBhk(e.target.value)} />
      </div>
      <div className={`grid grid-cols-2 gap-3 ${isOpen ? 'block' : 'hidden md:grid'}`}>
        <Button type="button" className="w-full" onClick={applyFilters}>Apply filters</Button>
        <Button type="button" variant="outline" className="w-full" onClick={clearFilters}>Clear</Button>
      </div>
    </aside>
  );
}
