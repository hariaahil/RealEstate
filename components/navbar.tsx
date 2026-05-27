'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/app/providers';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/rent', label: 'Rentals' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [role, setRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user) {
      const supabase = createBrowserSupabaseClient();
      supabase.from('profiles').select('role').eq('id', user.id).single().then(({ data }) => {
        setRole(data?.role || user.user_metadata?.role || user.app_metadata?.role || 'customer');
      });
    } else {
      setRole(undefined);
    }
  }, [user]);

  const dashboardNavItems = [
    ...(role === 'agent' || role === 'admin' ? [{ href: '/dashboard/agent', label: 'Agent Hub' }] : []),
    ...(role === 'admin' ? [{ href: '/dashboard/admin', label: 'Admin Hub' }] : []),
  ];

  const visibleNavItems = [...navItems, ...dashboardNavItems];
  const profileHref = role === 'admin' ? '/dashboard/admin' : role === 'agent' ? '/dashboard/agent' : '/dashboard/user';
  const profileLabel = user?.email?.split('@')[0] || 'My Profile';

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3 text-zinc-900">
          <div className="flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-soft sm:rounded-2xl">
            <Image src="/icon.svg" alt="HydPropertiesHub icon" width={38} height={38} className="h-9 w-9 sm:h-10 sm:w-10" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold sm:text-lg">HydPropertiesHub</p>
            <p className="hidden text-xs text-zinc-600 sm:block">Verified Hyderabad Properties</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {visibleNavItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-zinc-700 transition hover:text-zinc-900">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="success" className="hidden sm:inline-flex">Trusted Agents</Badge>
          <Link href="/properties" className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200 px-3 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:h-10 sm:px-4 sm:text-sm">
            View Listings
          </Link>
          {user ? (
            <>
              <Link href={profileHref} className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200 px-3 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:h-10 sm:px-4 sm:text-sm">
                {profileLabel}
              </Link>
              <button
                onClick={() => signOut()}
                className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200 px-3 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:h-10 sm:px-4 sm:text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-full border border-zinc-200 px-3 text-xs font-semibold text-zinc-900 transition hover:bg-zinc-100 sm:h-10 sm:px-4 sm:text-sm">
              Login
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-zinc-200 bg-white px-4 py-4 lg:hidden"
        >
          <nav className="flex flex-col gap-2">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href={profileHref} onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900">{profileLabel}</Link>
                <button onClick={() => { setMobileMenuOpen(false); void signOut(); }} className="rounded-lg px-4 py-3 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900">Logout</button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900">Login</Link>
            )}
            <Badge variant="success" className="mt-2 w-fit">Trusted Agents</Badge>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}
