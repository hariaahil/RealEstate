import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendEmail } from '@/lib/email';

async function findAuthUserIdByEmail(email: string) {
  if (!supabaseAdmin) return null;

  try {
    const listResult = await supabaseAdmin.auth.admin.listUsers({ query: email });
    const users = listResult?.data?.users ?? [];
    const user = users.find((item: any) => item.email === email);
    return user?.id ?? null;
  } catch (error) {
    console.error('Failed to find auth user by email:', error);
    return null;
  }
}

async function syncAgentRole(agent: any, status: string) {
  if (!supabaseAdmin) {
    console.warn('Service role client not configured. Skipping auth role sync.');
    return;
  }

  const userId = agent.user_id || (await findAuthUserIdByEmail(agent.email));
  if (!userId) {
    console.warn('No auth user id found for agent:', agent.email);
    return;
  }

  if (status === 'approved') {
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { role: 'agent' },
    });
  }
}

async function notifyAgent(agent: any, status: string) {
  const subject = status === 'approved'
    ? 'HydPropertiesHub Agent Application Approved'
    : 'HydPropertiesHub Agent Application Update';

  const html = status === 'approved'
    ? `<p>Hi ${agent.name},</p><p>Your agent application has been approved. Your HydPropertiesHub agent dashboard is now available.</p><p>Sign in to manage listings and leads.</p>`
    : `<p>Hi ${agent.name},</p><p>Thank you for applying to join HydPropertiesHub.</p><p>We reviewed your application and it was not approved at this time. You can reapply after refining your profile.</p>`;

  await sendEmail({
    to: agent.email,
    subject,
    text: html.replace(/<[^>]+>/g, ''),
    html,
  });
}

export async function PATCH(request: NextRequest, context: any) {
  try {
    const id = context?.params?.id;
    const body = await request.json();
    const { status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json({ success: true, agent: { id, status } });
    }

    const { data: agent, error: agentError } = await supabaseClient!
      .from('agents')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (agentError) {
      console.error('Agent status update error:', agentError);
      return NextResponse.json({ error: agentError.message }, { status: 500 });
    }

    await syncAgentRole(agent, status);
    await notifyAgent(agent, status);

    return NextResponse.json({ success: true, agent });
  } catch (err) {
    console.error('Agent status PATCH failed:', err);
    return NextResponse.json({ error: 'Unable to update agent status' }, { status: 500 });
  }
}
