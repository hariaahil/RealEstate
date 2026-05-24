import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { sampleInquiries } from '@/lib/sampleData';
import { sendLeadNotification } from '@/services/notificationService';
import type { Inquiry } from '@/types';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const payload = {
    property_id: body.property_id,
    buyer_name: body.buyer_name,
    buyer_phone: body.buyer_phone,
    buyer_email: body.buyer_email,
    message: body.message,
    inquiry_status: 'new' as const,
    assigned_agent_id: body.assigned_agent_id,
    created_at: new Date().toISOString(),
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const fakeInquiry: Inquiry = {
      id: `inq-${Math.random().toString(36).slice(2, 8)}`,
      property_id: body.property_id,
      buyer_name: body.buyer_name,
      buyer_phone: body.buyer_phone,
      buyer_email: body.buyer_email,
      message: body.message,
      inquiry_status: 'new',
      assigned_agent_id: body.assigned_agent_id,
      created_at: payload.created_at,
    };

    await sendLeadNotification(fakeInquiry);
    return NextResponse.json({ success: true, inquiry: fakeInquiry });
  }

  const { data, error } = await supabaseClient!.from('inquiries').insert([payload]).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await sendLeadNotification(data);

  return NextResponse.json({ success: true, inquiry: data });
}

export async function GET(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get('agent_id');
  const status = request.nextUrl.searchParams.get('status');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const inquiries = sampleInquiries
      .filter((inquiry) => (agentId ? inquiry.assigned_agent_id === agentId : true))
      .filter((inquiry) => (status ? inquiry.inquiry_status === status : true));

    return NextResponse.json({ inquiries });
  }

  let query = supabaseClient!.from('inquiries').select('*').order('created_at', { ascending: false });

  if (agentId) {
    query = query.eq('assigned_agent_id', agentId);
  }

  if (status) {
    query = query.eq('inquiry_status', status);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  const payload = {
    inquiry_status: body.inquiry_status,
    assigned_agent_id: body.assigned_agent_id,
  };

  if (!body.id) {
    return NextResponse.json({ error: 'Missing inquiry id' }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const inquiry = sampleInquiries.find((item) => item.id === body.id);
    if (!inquiry) {
      return NextResponse.json({ error: 'Inquiry not found' }, { status: 404 });
    }
    const updated = { ...inquiry, ...payload };
    await sendLeadNotification(updated);
    return NextResponse.json({ success: true, inquiry: updated });
  }

  const { data, error } = await supabaseClient!
    .from('inquiries')
    .update(payload)
    .eq('id', body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await sendLeadNotification(data);
  return NextResponse.json({ success: true, inquiry: data });
}
