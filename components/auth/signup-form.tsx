 'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PlatformSettings, UserRole } from '@/types';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  whatsapp: '',
  areaSpecialization: '',
  bio: '',
  role: 'user' as UserRole,
};

export function SignupForm() {
  const [supabase, setSupabase] = useState<any | null>(null);
  const [form, setForm] = useState(initialForm);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setSupabase(createBrowserSupabaseClient());
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (response.ok) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to load signup settings', error);
      }
    };
    loadSettings();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setReturnTo(params.get('returnTo'));
    }
  }, []);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      setMessage('Unable to initialize authentication client.');
      return;
    }

    if (form.role === 'agent' && settings && !settings.enable_agent_signup) {
      setMessage('Agent signup is disabled. Please apply to join as an agent.');
      return;
    }

    if (form.role === 'user' && settings && !settings.enable_customer_signup) {
      setMessage('Customer signup is currently disabled.');
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const { data, error } = await supabase.auth.signUp(
      {
        email: form.email,
        password: form.password,
      },
      {
        data: {
          role: form.role,
          name: form.name,
          phone: form.phone,
        },
      }
    );

    setIsLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    const redirectTo = returnTo ?? undefined;
    if (form.role === 'admin') {
      router.push('/dashboard/admin');
      return;
    }

    if (form.role === 'agent') {
      router.push('/dashboard/agent');
      return;
    }

    router.push(redirectTo ?? '/dashboard/user');
    setMessage('Check your inbox for a confirmation link or OTP to complete signup.');
  };

  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-soft">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Create your account</p>
        <h1 className="text-3xl font-semibold text-zinc-950">Sign up for HydPropertiesHub</h1>
        <p className="text-sm text-zinc-500">Register as a buyer or start your agent application with the latest Hyderabad listings.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Full name
            <Input
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Your full name"
              required
              className="mt-2"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Mobile
            <Input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              placeholder="+919876543210"
              required
              className="mt-2"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Email address
            <Input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="you@example.com"
              required
              className="mt-2"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Password
            <Input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Choose a secure password"
              required
              className="mt-2"
            />
          </label>
        </div>

        <div className="space-y-3 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
          <p className="text-sm font-semibold text-zinc-900">Account type</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              { label: 'Buyer', value: 'user' as UserRole },
              { label: 'Agent', value: 'agent' as UserRole },
            ]).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField('role', option.value)}
                className={`rounded-3xl border px-4 py-3 text-left text-sm font-medium transition ${
                  form.role === option.value ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-zinc-200 bg-white text-zinc-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {form.role === 'agent' && settings && !settings.enable_agent_signup ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Agent signup is disabled by default. <a href="/agent/apply" className="font-semibold text-amber-900 underline">Apply to join as an agent</a> and we will review your profile.
          </div>
        ) : null}

        {message ? <p className="text-sm text-red-600">{message}</p> : null}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </div>
  );
}
