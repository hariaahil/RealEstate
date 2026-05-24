import { supabaseClient } from '@/lib/supabaseClient';
import { sampleAgents } from '@/lib/sampleData';
import type { Agent } from '@/types';

export async function getAgents(): Promise<Agent[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return sampleAgents;
  }

  const { data, error } = await supabaseClient!.from('agents').select('*');
  if (error || !data) {
    return sampleAgents;
  }

  return data as Agent[];
}

export async function getAgentById(agentId: string): Promise<Agent | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return sampleAgents.find((agent) => agent.id === agentId) ?? null;
  }

  const { data, error } = await supabaseClient!.from('agents').select('*').eq('id', agentId).single();
  if (error || !data) {
    return null;
  }

  return data as Agent;
}
