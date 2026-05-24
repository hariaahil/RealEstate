import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { sampleInquiries } from '@/lib/sampleData';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const payload = {
    property_id: body.property_id,
    buyer_name: body.buyer_name,
    buyer_phone: body.buyer_phone,
    buyer_email: body.buyer_email,
    message: body.message,
    inquiry_status: 'new',
    assigned_agent_id: body.assigned_agent_id,
    created_at: new Date().toISOString(),
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ success: true, inquiry: { ...payload, id: `inq-${Math.random().toString(36).slice(2, 8)}` } });
  }

  const { data, error } = await supabaseClient!.from('inquiries').insert([payload]).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, inquiry: data });
}

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ inquiries: sampleInquiries });
  }

  const { data, error } = await supabaseClient!.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data });
}
