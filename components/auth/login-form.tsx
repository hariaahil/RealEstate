'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PlatformSettings } from '@/types';

export function AuthLoginForm({ settings }: { settings: PlatformSettings }) {
  const [supabase, setSupabase] = useState<any | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSupabase(createBrowserSupabaseClient());
  }, []);

  const routeByRole = (role?: string) => {
    if (role === 'admin') return router.push('/dashboard/admin');
    if (role === 'agent') return router.push('/dashboard/agent');
    return router.push('/dashboard/user');
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!settings.enable_email_login) return setMessage('Email login is currently disabled by admin.');
    if (!supabase) return setMessage('Unable to initialize authentication client.');

    setIsLoading(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);
    if (error) return setMessage(error.message);
    routeByRole(data.user?.app_metadata?.role);
  };

  const handleOtpLogin = async () => {
    if (!settings.enable_otp_login) return setMessage('OTP login is currently disabled by admin.');
    if (!supabase) return;
    if (!phone.trim()) return setMessage('Please enter mobile number with country code.');
    setIsLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({ phone: phone.trim() });
    setIsLoading(false);
    setMessage(error ? error.message : 'OTP sent. Please verify in your SMS to continue.');
  };

  const handleGoogleLogin = async () => {
    if (!settings.enable_google_login) return setMessage('Google login is currently disabled by admin.');
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setMessage(error.message);
  };

  return (
    <div className="mx-auto max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-10 shadow-soft">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-600">Welcome back</p>
        <h1 className="text-3xl font-semibold text-zinc-950">Sign in to HydPropertiesHub</h1>
      </div>

      <form onSubmit={handleSignIn} className="mt-8 space-y-6">
        <div className="space-y-3 rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <p className="text-sm font-semibold text-brand-700">Primary login: Mobile OTP</p>
          <Input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+919876543210" className="mt-2" />
          <Button type="button" onClick={handleOtpLogin} disabled={isLoading || !settings.enable_otp_login} className="w-full">Send OTP</Button>
          <Button type="button" variant="outline" onClick={handleGoogleLogin} disabled={!settings.enable_google_login} className="w-full">Continue with Google</Button>
        </div>

        <div className="space-y-4">
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required className="mt-2" />
          <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required className="mt-2" />
        </div>

        {message ? <p className="text-sm text-red-600">{message}</p> : null}
        <Button type="submit" disabled={isLoading || !settings.enable_email_login} className="w-full">{isLoading ? 'Signing in…' : 'Sign in'}</Button>
      </form>
    </div>
  );
}
