'use client';

import { FormEvent, useState } from 'react';

export function UserRoleManager() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'agent' | 'admin'>('user');
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const response = await fetch('/api/admin/users/role', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });

    const payload = await response.json();
    setSaving(false);

    if (!response.ok) {
      setMessage(payload.error ?? 'Unable to update role.');
      return;
    }

    setMessage(`Updated ${payload.email} to role: ${payload.role}`);
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-2xl border border-zinc-200 p-5">
      <p className="text-sm font-medium text-zinc-700">Change user role (works for Google login users too)</p>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        placeholder="user@example.com"
        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm"
      />
      <select
        value={role}
        onChange={(event) => setRole(event.target.value as 'user' | 'agent' | 'admin')}
        className="h-11 w-full rounded-xl border border-zinc-200 px-3 text-sm"
      >
        <option value="user">User</option>
        <option value="agent">Agent</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit" disabled={saving} className="inline-flex h-10 items-center rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white disabled:opacity-60">
        {saving ? 'Updating…' : 'Update role'}
      </button>
      {message ? <p className="text-sm text-zinc-600">{message}</p> : null}
    </form>
  );
}
