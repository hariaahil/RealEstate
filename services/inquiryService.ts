import { supabaseClient } from '@/lib/supabaseClient';
import type { Inquiry, InquiryStatus } from '@/types';

export async function saveInquiry(inquiry: Omit<Inquiry, 'id' | 'created_at'>): Promise<Inquiry | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      ...inquiry,
      id: `inq-${Math.random().toString(36).slice(2, 8)}`,
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabaseClient!.from('inquiries').insert([inquiry]).select().single();
  if (error || !data) {
    console.error('Error saving inquiry:', error);
    return null;
  }

  return data as Inquiry;
}

export async function getInquiries(agentId?: string, status?: InquiryStatus): Promise<Inquiry[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return [];
  }

  let query = supabaseClient!.from('inquiries').select('*').order('created_at', { ascending: false });

  if (agentId) {
    query = query.eq('assigned_agent_id', agentId);
  }

  if (status) {
    query = query.eq('inquiry_status', status);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error('Error getting inquiries:', error);
    return [];
  }

  return data as Inquiry[];
}

export async function updateInquiryStatus(inquiryId: string, status: InquiryStatus): Promise<Inquiry | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const { data, error } = await supabaseClient!
    .from('inquiries')
    .update({ inquiry_status: status })
    .eq('id', inquiryId)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating inquiry status:', error);
    return null;
  }

  return data as Inquiry;
}

export async function assignInquiryAgent(inquiryId: string, agentId: string): Promise<Inquiry | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null;
  }

  const { data, error } = await supabaseClient!
    .from('inquiries')
    .update({ assigned_agent_id: agentId })
    .eq('id', inquiryId)
    .select()
    .single();

  if (error || !data) {
    console.error('Error assigning inquiry agent:', error);
    return null;
  }

  return data as Inquiry;
}
