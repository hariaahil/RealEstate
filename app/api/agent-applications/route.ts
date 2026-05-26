import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      whatsapp: body.whatsapp,
      area_specialization: body.area_specialization || [],
      profile_image: body.profile_image || '',
      bio: body.bio,
      role: 'agent',
      status: 'pending',
    };

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true, application: payload });
    }

    const { data, error } = await supabaseClient!
      .from('agents')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Agent application error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, application: data });
  } catch (error) {
    console.error('Agent application failed:', error);
    return NextResponse.json({ error: 'Unable to submit agent application' }, { status: 500 });
  }
}
