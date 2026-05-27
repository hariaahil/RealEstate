'use client';
import { useState } from 'react';
import type { PlatformSettings } from '@/types';
import { Button } from '@/components/ui/button';

type Props = { initialSettings: PlatformSettings };

export function AuthSettingsForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const fields: Array<keyof Pick<PlatformSettings, 'enable_google_login' | 'enable_otp_login' | 'enable_email_login' | 'enable_customer_signup' | 'enable_agent_signup' | 'maintenance_mode'>> = [
    'enable_google_login',
    'enable_otp_login',
    'enable_email_login',
    'enable_customer_signup',
    'enable_agent_signup',
    'maintenance_mode',
  ];

  async function save() {
    setSaving(true);
    const res = await fetch('/api/platform-settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    if (res.ok) setSettings(await res.json());
    setSaving(false);
  }

  return <div className='mx-auto max-w-3xl px-6 py-10'>
    <h1 className='text-3xl font-semibold'>Admin Auth Settings</h1>
    <div className='mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-soft'>
      {fields.map((field) => <label key={field} className='flex items-center justify-between border-b py-3'>
        <span className='capitalize'>{field.split('_').join(' ')}</span>
        <input type='checkbox' checked={Boolean(settings[field])} onChange={(e) => setSettings((prev) => ({ ...prev, [field]: e.target.checked }))} />
      </label>)}
      <Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save settings'}</Button>
    </div>
  </div>;
}
