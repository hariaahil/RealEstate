import type { Metadata } from 'next';
import { AuthLoginForm } from '@/components/auth/login-form';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login | HydPropertiesHub',
  description: 'Sign in to access agent and admin dashboards.',
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[3rem] bg-white p-10 shadow-soft">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Secure access</p>
            <h1 className="mt-4 text-4xl font-semibold text-zinc-950">Sign in to your dashboard.</h1>
            <p className="mt-3 max-w-2xl text-sm text-zinc-500">
              Agents and admins can log in here to manage listings, inquiries, approvals, and leads.
            </p>
            <div className="mt-6 text-sm text-zinc-600">
              New to HydPropertiesHub?{' '}
              <Link href="/signup" className="font-semibold text-zinc-900 underline hover:text-zinc-700">
                Create an account
              </Link>
            </div>
          </div>
        </div>

        <AuthLoginForm />
      </div>
    </div>
  );
}
