'use client';

import { FormEvent, useState } from 'react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

type Props = {
  initialName: string;
};

export function ProfileDetailsForm({ initialName }: Props) {
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    });

    setSaving(false);
    setStatus(error ? error.message : 'Profile updated successfully.');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <label className="text-sm font-medium text-zinc-700" htmlFor="full_name">Full name</label>
      <input
        id="full_name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your full name"
        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm outline-none ring-brand-200 focus:ring"
      />
      <button type="submit" disabled={saving} className="inline-flex h-10 items-center rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white disabled:opacity-60">
        {saving ? 'Saving…' : 'Save profile'}
      </button>
      {status ? <p className="text-sm text-zinc-600">{status}</p> : null}
    </form>
  );
}
