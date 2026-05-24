import { supabaseClient } from '@/lib/supabaseClient';
import { sampleInquiries } from '@/lib/sampleData';
import type { Inquiry } from '@/types';

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
    return null;
  }

  return data as Inquiry;
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return sampleInquiries;
  }

  const { data, error } = await supabaseClient!.from('inquiries').select('*').order('created_at', { ascending: false });
  if (error || !data) {
    return sampleInquiries;
  }

  return data as Inquiry[];
}
