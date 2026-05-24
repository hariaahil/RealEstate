import { NextRequest, NextResponse } from 'next/server';
import { saveRentalInquiry, getRentalInquiries } from '@/services/rentalService';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const payload = {
    property_id: body.property_id,
    tenant_name: body.tenant_name,
    tenant_phone: body.tenant_phone,
    occupation: body.occupation,
    budget: Number(body.budget || 0),
    family_type: body.family_type,
    move_in_date: body.move_in_date,
    assigned_agent_id: body.assigned_agent_id,
    inquiry_status: 'new' as const,
  };

  const inquiry = await saveRentalInquiry(payload);
  if (!inquiry) {
    return NextResponse.json({ error: 'Unable to submit rental inquiry' }, { status: 500 });
  }

  return NextResponse.json({ success: true, inquiry });
}

export async function GET(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get('agent_id') || undefined;
  const status = request.nextUrl.searchParams.get('status') as any;

  const inquiries = await getRentalInquiries(agentId, status);
  return NextResponse.json({ inquiries });
}
