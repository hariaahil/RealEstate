'use client';

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/providers';

interface UnlockContactModalProps {
  propertyId: string;
  propertyTitle: string;
  agentPhone: string;
  unlockPrice: number;
  onSuccess?: () => void;
}

export function UnlockContactModal({ propertyId, propertyTitle, agentPhone, unlockPrice, onSuccess }: UnlockContactModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'initial' | 'payment' | 'success'>('initial');

  const handleUnlock = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setStep('payment');

    // Simulate Razorpay payment flow
    setTimeout(async () => {
      try {
        const response = await fetch('/api/contact-unlocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            property_id: propertyId,
            amount_paid: unlockPrice,
            payment_status: 'paid',
          }),
        });

        if (response.ok) {
          setStep('success');
          setTimeout(() => {
            onSuccess?.();
          }, 2000);
        }
      } catch (error) {
        console.error('Payment failed:', error);
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
        {step === 'initial' && (
          <>
            <h3 className="text-2xl font-semibold text-zinc-950">Unlock Contact Details</h3>
            <p className="mt-4 text-zinc-600">
              Pay <span className="font-semibold text-zinc-900">₹{unlockPrice}</span> to unlock the agent's contact information for:
            </p>
            <p className="mt-2 text-sm font-medium text-zinc-900">{propertyTitle}</p>
            
            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-sm text-zinc-600">What you get:</p>
              <ul className="mt-2 space-y-1 text-sm text-zinc-700">
                <li>✓ Direct phone number</li>
                <li>✓ WhatsApp contact</li>
                <li>✓ Unlimited calls</li>
                <li>✓ Property verification support</li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onSuccess}>Cancel</Button>
              <Button className="flex-1" onClick={handleUnlock} disabled={loading}>
                {loading ? 'Processing...' : `Pay ₹${unlockPrice}`}
              </Button>
            </div>
          </>
        )}

        {step === 'payment' && (
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
            <p className="mt-6 text-lg font-medium text-zinc-900">Processing Payment...</p>
            <p className="mt-2 text-sm text-zinc-600">Please wait while we complete your transaction</p>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-zinc-950">Payment Successful!</h3>
            <p className="mt-2 text-zinc-600">Contact details unlocked. Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  );
}
