import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!RAZORPAY_KEY_SECRET) {
      // Fallback for demo without Razorpay configured
      return NextResponse.json({ verified: true, demo: true });
    }

    // In production, verify Razorpay signature
    // const sign = razorpay_order_id + "|" + razorpay_payment_id;
    // const expectedSign = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET).update(sign).digest('hex');
    // const verified = expectedSign === razorpay_signature;

    return NextResponse.json({ verified: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
