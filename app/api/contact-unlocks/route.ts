import { NextRequest, NextResponse } from 'next/server';
import { saveContactUnlock } from '@/services/rentalService';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const payload = {
    user_id: body.user_id || 'guest',
    property_id: body.property_id,
    amount_paid: Number(body.amount_paid || 0),
    payment_status: body.payment_status || 'paid',
  };

  const unlock = await saveContactUnlock(payload);
  if (!unlock) {
    return NextResponse.json({ error: 'Unable to create unlock history' }, { status: 500 });
  }

  return NextResponse.json({ success: true, unlock });
}
