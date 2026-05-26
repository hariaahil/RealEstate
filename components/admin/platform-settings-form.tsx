'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PlatformSettings } from '@/types';

type Props = {
  settings: PlatformSettings;
};

const toggleClasses = 'inline-flex h-12 items-center justify-between rounded-3xl border px-4 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400';

export function PlatformSettingsForm({ settings }: Props) {
  const [formState, setFormState] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggle = (key: keyof PlatformSettings) => {
    setFormState((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const response = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formState),
    });
    const result = await response.json();

    if (!response.ok) {
      setMessage(result.error || 'Unable to save settings.');
      setIsSaving(false);
      return;
    }

    setFormState(result.settings);
    setMessage('Settings saved successfully.');
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            { label: 'Google Login', key: 'enable_google_login' as const },
            { label: 'OTP Login', key: 'enable_otp_login' as const },
            { label: 'Email Login', key: 'enable_email_login' as const },
            { label: 'Customer signup', key: 'enable_customer_signup' as const },
            { label: 'Agent signup', key: 'enable_agent_signup' as const },
            { label: 'Maintenance mode', key: 'maintenance_mode' as const },
          ]
        ).map(({ label, key }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleToggle(key)}
            className={cn(
              toggleClasses,
              formState[key] ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-zinc-200 bg-white text-zinc-700'
            )}
          >
            <span>{label}</span>
            <span className="inline-flex h-5 w-10 items-center rounded-full bg-white text-[0.6rem] font-bold uppercase tracking-[0.22em] text-zinc-500 ring-1 ring-zinc-200">
              {formState[key] ? 'ON' : 'OFF'}
            </span>
          </button>
        ))}
      </div>

      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}

      <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
        {isSaving ? 'Saving settings…' : 'Update platform settings'}
      </Button>
    </form>
  );
}
