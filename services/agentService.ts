import { isSupabaseClientConfigured, supabaseClient } from '@/lib/supabaseClient';
import type { Agent } from '@/types';

export async function getAgents(): Promise<Agent[]> {
  if (!isSupabaseClientConfigured) {
    console.warn('Supabase URL not configured. Returning empty array.');
    return [];
  }

  const { data, error } = await supabaseClient!.from('agents').select('*');
  if (error || !data) {
    console.error('Error fetching agents:', error);
    return [];
  }

  return data as Agent[];
}

export async function getAgentById(agentId: string): Promise<Agent | null> {
  if (!isSupabaseClientConfigured) {
    return null;
  }

  const { data, error } = await supabaseClient!.from('agents').select('*').eq('id', agentId).single();
  if (error || !data) {
    return null;
  }

  return data as Agent;
}
