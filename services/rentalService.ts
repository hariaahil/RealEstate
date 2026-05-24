import { supabaseClient } from '@/lib/supabaseClient';
import { sampleContactUnlocks, sampleRentalInquiries } from '@/lib/sampleData';
import type { ContactUnlock, RentalInquiry, InquiryStatus } from '@/types';

export async function saveRentalInquiry(inquiry: Omit<RentalInquiry, 'id' | 'created_at'>): Promise<RentalInquiry | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      ...inquiry,
      id: `rinq-${Math.random().toString(36).slice(2, 8)}`,
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabaseClient!
    .from('rental_inquiries')
    .insert([inquiry])
    .select()
    .single();

  if (error || !data) {
    console.error('Error saving rental inquiry:', error);
    return null;
  }

  return data as RentalInquiry;
}

export async function getRentalInquiries(agentId?: string, status?: InquiryStatus): Promise<RentalInquiry[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return sampleRentalInquiries
      .filter((inquiry) => (agentId ? inquiry.assigned_agent_id === agentId : true))
      .filter((inquiry) => (status ? inquiry.inquiry_status === status : true));
  }

  let query = supabaseClient!.from('rental_inquiries').select('*').order('created_at', { ascending: false });

  if (agentId) {
    query = query.eq('assigned_agent_id', agentId);
  }

  if (status) {
    query = query.eq('inquiry_status', status);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error('Error getting rental inquiries:', error);
    return [];
  }

  return data as RentalInquiry[];
}

export async function saveContactUnlock(unlock: Omit<ContactUnlock, 'id' | 'unlocked_at'>): Promise<ContactUnlock | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      ...unlock,
      id: `unlock-${Math.random().toString(36).slice(2, 8)}`,
      unlocked_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabaseClient!
    .from('contact_unlocks')
    .insert([unlock])
    .select()
    .single();

  if (error || !data) {
    console.error('Error saving contact unlock:', error);
    return null;
  }

  return data as ContactUnlock;
}

export async function getContactUnlocks(userId?: string): Promise<ContactUnlock[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return userId ? sampleContactUnlocks.filter((unlock) => unlock.user_id === userId) : sampleContactUnlocks;
  }

  let query = supabaseClient!.from('contact_unlocks').select('*').order('unlocked_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;
  if (error || !data) {
    console.error('Error getting contact unlock records:', error);
    return [];
  }

  return data as ContactUnlock[];
}
