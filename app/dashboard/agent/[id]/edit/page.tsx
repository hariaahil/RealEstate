import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabaseClient';
import { getPropertyById } from '@/services/propertyService';
import { PropertyForm } from '@/components/property/property-form';

export default async function AgentEditPropertyPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const session = await supabase?.auth.getSession();

  if (!session?.data.session) {
    redirect('/login');
  }

  const property = await getPropertyById(params.id);

  if (!property) {
    redirect('/dashboard/agent');
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <PropertyForm property={property} />
    </div>
  );
}
