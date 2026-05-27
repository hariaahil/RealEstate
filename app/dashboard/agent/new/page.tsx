import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { PropertyForm } from '@/components/property/property-form';
import { getUserRole } from '@/lib/auth';

export default async function AgentNewPropertyPage() {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();

  if (!session?.data.session) {
    redirect('/login');
  }

  const role = getUserRole(session.data.session.user);
  if (role !== 'agent' && role !== 'admin') {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <PropertyForm />
    </div>
  );
}
