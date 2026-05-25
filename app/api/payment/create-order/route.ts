import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, property_id } = body;

    // Fallback for demo without Razorpay configured
    // In production, integrate with actual Razorpay API
    return NextResponse.json({ 
      order_id: `order_${Date.now()}`, 
      amount,
      property_id,
      demo: true 
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
