 'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const initialState = {
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  areaSpecialization: '',
  bio: '',
};

export function AgentApplicationForm() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const response = await fetch('/api/agent-applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        area_specialization: form.areaSpecialization.split(',').map((value) => value.trim()).filter(Boolean),
        bio: form.bio,
      }),
    });

    const result = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setMessage(result.error || 'Unable to submit application.');
      return;
    }

    setMessage('Application submitted successfully. Our team will review your profile shortly.');
    setForm(initialState);
  };

  return (
    <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-soft">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Full name
            <Input value={form.name} onChange={(event) => updateField('name', event.target.value)} required className="mt-2" />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Email
            <Input type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required className="mt-2" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium text-zinc-700">
            Mobile number
            <Input type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} required className="mt-2" />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            WhatsApp number
            <Input type="tel" value={form.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} required className="mt-2" />
          </label>
        </div>

        <label className="block text-sm font-medium text-zinc-700">
          Preferred areas
          <Input
            value={form.areaSpecialization}
            onChange={(event) => updateField('areaSpecialization', event.target.value)}
            placeholder="e.g. Gachibowli, Kondapur"
            className="mt-2"
            required
          />
        </label>

        <label className="block text-sm font-medium text-zinc-700">
          Why should you be approved?
          <Textarea value={form.bio} onChange={(event) => updateField('bio', event.target.value)} placeholder="Share your experience and service approach." className="mt-2" required />
        </label>

        {message ? <p className="text-sm text-zinc-700">{message}</p> : null}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Submitting…' : 'Submit application'}
        </Button>
      </form>
    </div>
  );
}
