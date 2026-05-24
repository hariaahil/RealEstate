'use client';

import { useState } from 'react';
import type { Inquiry, InquiryStatus } from '@/types';
import { Button } from '@/components/ui/button';

const statuses: InquiryStatus[] = ['new', 'contacted', 'qualified', 'closed'];

export function InquiryStatusControl({ inquiry }: { inquiry: Inquiry }) {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.inquiry_status);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleStatusChange = async (value: InquiryStatus) => {
    setIsSaving(true);
    setMessage(null);

    const response = await fetch('/api/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: inquiry.id, inquiry_status: value }),
    });

    const result = await response.json();
    if (response.ok && result.inquiry) {
      setStatus(result.inquiry.inquiry_status);
      setMessage('Status updated.');
    } else {
      setMessage(result.error || 'Unable to save status.');
    }

    setIsSaving(false);
  };

  return (
    <div className="mt-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900">Lead status</p>
          <p className="text-sm text-zinc-500">Update lead progress for this inquiry.</p>
        </div>
        <select
          value={status}
          onChange={(event) => void handleStatusChange(event.target.value as InquiryStatus)}
          className="max-w-xs rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          {statuses.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {message ? <p className="mt-3 text-sm text-zinc-600">{message}</p> : null}
      <Button type="button" onClick={() => handleStatusChange(status)} disabled={isSaving} className="mt-4">
        {isSaving ? 'Saving…' : 'Save status'}
      </Button>
    </div>
  );
}
