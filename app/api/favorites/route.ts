import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const payload = {
    user_id: body.user_id || 'guest',
    property_id: body.property_id,
  };

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ success: true, favorite: { id: `fav-${Math.random().toString(36).slice(2, 8)}`, ...payload } });
  }

  const { data, error } = await supabaseClient!.from('favorites').insert([payload]).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, favorite: data });
}

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ favorites: [] });
  }

  const { data, error } = await supabaseClient!.from('favorites').select('*');
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorites: data });
}
