import type { User } from '@supabase/supabase-js';
import type { UserRole } from '@/types';

export function getUserRole(user?: User | null): UserRole {
  const appRole = user?.app_metadata?.role;
  if (appRole === 'admin' || appRole === 'agent' || appRole === 'user') return appRole;

  const userRole = user?.user_metadata?.role;
  if (userRole === 'admin' || userRole === 'agent' || userRole === 'user') return userRole;

  return 'user';
}
