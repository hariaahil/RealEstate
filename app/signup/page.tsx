import type { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Sign up | HydPropertiesHub',
  description: 'Create a new account at HydPropertiesHub and start browsing premium Hyderabad properties.',
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6 rounded-[3rem] bg-white p-10 shadow-soft lg:p-14">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Welcome to HydPropertiesHub</p>
          <h1 className="text-4xl font-semibold text-zinc-950 sm:text-5xl">Join Hyderabad’s premium property network.</h1>
          <p className="max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
            Create a buyer account to save favorites, unlock contact details, and manage your property search. Agents can apply to join our verified community.
          </p>
          <div className="space-y-4 rounded-[2rem] border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-sm font-semibold text-zinc-900">Already have an account?</p>
            <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Go to login
            </Link>
          </div>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
