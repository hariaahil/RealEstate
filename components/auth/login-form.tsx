'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AuthLoginForm() {
  const [supabase, setSupabase] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSupabase(createBrowserSupabaseClient());
  }, []);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setMessage('Unable to initialize authentication client.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push('/dashboard/agent');
  };

  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-soft">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Welcome back</p>
        <h1 className="text-3xl font-semibold text-zinc-950">Sign in to HydPropertyHub</h1>
        <p className="text-sm text-zinc-500">Enter your email and password to access your agent or admin dashboard.</p>
      </div>

      <form onSubmit={handleSignIn} className="mt-8 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-zinc-700">
            Email
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="mt-2"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-700">
            Password
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              className="mt-2"
            />
          </label>
        </div>

        {message ? <p className="text-sm text-red-600">{message}</p> : null}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
