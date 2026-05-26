'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PaymentButtonProps {
  amount: number;
  propertyId: string;
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: Error) => void;
}

export function PaymentButton({ amount, propertyId, onSuccess, onFailure }: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Initialize Razorpay payment
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'HydPropertiesHub',
        description: 'Contact Unlock Payment',
        order_id: await createOrder(amount, propertyId),
        handler: async (response: any) => {
          const verified = await verifyPayment(response);
          if (verified) {
            onSuccess?.(response.razorpay_payment_id);
          } else {
            onFailure?.(new Error('Payment verification failed'));
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#10B981',
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      onFailure?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (amount: number, propertyId: string): Promise<string> => {
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, property_id: propertyId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment order');
    }

    const data = await response.json();
    return data.order_id;
  };

  const verifyPayment = async (response: any): Promise<boolean> => {
    const verifyResponse = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    });

    if (!verifyResponse.ok) {
      return false;
    }

    const data = await verifyResponse.json();
    return data.verified;
  };

  return (
    <Button onClick={handlePayment} disabled={loading} className="w-full">
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </Button>
  );
}
