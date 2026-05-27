'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Agent } from '@/types';

type Props = {
  agent: Agent;
};

export function AgentApprovalControl({ agent }: Props) {
  const [status, setStatus] = useState(agent.status ?? 'pending');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateStatus = async (newStatus: 'approved' | 'rejected') => {
    if (status === newStatus) return;
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to update status');
      } else {
        setStatus(data.agent.status || newStatus);
        setMessage('Status updated');
      }
    } catch (err) {
      setMessage('Network error');
    }

    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-700">Status: <strong className="ml-1">{status}</strong></span>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={() => updateStatus('approved')} disabled={isLoading || status === 'approved'}>
          Approve
        </Button>
        <Button size="sm" variant="outline" onClick={() => updateStatus('rejected')} disabled={isLoading || status === 'rejected'}>
          Reject
        </Button>
      </div>
      {message ? <span className="text-sm text-zinc-600">{message}</span> : null}
    </div>
  );
}
