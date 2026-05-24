'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/dashboard/agent', label: 'Agent Hub' },
  { href: '/dashboard/admin', label: 'Admin Hub' },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-zinc-900">
          <div className="rounded-2xl bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-soft">HYD</div>
          <div>
            <p className="text-lg font-semibold">HydPropertyHub</p>
            <p className="text-sm text-zinc-600">Verified Hyderabad Properties</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-zinc-700 transition hover:text-zinc-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Badge variant="success">Trusted Agents</Badge>
          <Link href="/properties" className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100">
            View Listings
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
