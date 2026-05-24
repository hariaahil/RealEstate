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

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('user_id');

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ favorites: [] });
  }

  let query = supabaseClient!.from('favorites').select('*');
  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorites: data });
}

export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const userId = body.user_id || 'guest';
  const propertyId = body.property_id;

  if (!propertyId) {
    return NextResponse.json({ error: 'Missing property_id' }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabaseClient!
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('property_id', propertyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
