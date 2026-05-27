'use client';

'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type InquiryFormProps = {
  propertyId: string;
  agentId: string;
};

export function InquiryForm({ propertyId, agentId }: InquiryFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');

    await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: propertyId,
        assigned_agent_id: agentId,
        buyer_name: form.name,
        buyer_email: form.email,
        buyer_phone: form.phone,
        message: form.message,
      }),
    });

    setStatus('success');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-soft sm:p-5">
      <div>
        <p className="text-sm font-semibold text-zinc-900">Contact the assigned agent</p>
        <p className="mt-2 text-sm text-zinc-600">Send your details and our team will connect you shortly.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <Input placeholder="Email address" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
      </div>
      <Input placeholder="Phone number" type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required />
      <Textarea placeholder="Message or query" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} required />
      <Button type="submit" disabled={status === 'loading'}>{status === 'success' ? 'Inquiry Sent' : 'Send Inquiry'}</Button>
      {status === 'success' && <p className="text-sm text-emerald-700">Your request is submitted. Agent will contact you soon.</p>}
    </form>
  );
}
