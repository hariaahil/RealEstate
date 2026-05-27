import { createClient } from '@supabase/supabase-js';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import type { UserRole } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// AUTHENTICATION FUNCTIONS
// ==========================================

/**
 * Sign up a new user with email and password
 */
export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone: string,
  role: UserRole = 'customer'
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
          role,
        },
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Sign in with OTP (magic link)
 */
export async function signInWithOTP(email: string) {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Get current session
 */
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      session: null 
    };
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      user: null 
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(updates: {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Update password after reset
 */
export async function updateNewPassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

// ==========================================
// PROFILE FUNCTIONS
// ==========================================

/**
 * Get user profile by ID
 */
export async function getProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      profile: null 
    };
  }
}

/**
 * Get current user's profile
 */
export async function getCurrentUserProfile() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return { success: true, profile: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      profile: null 
    };
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const { profile } = await getCurrentUserProfile();
  return profile?.role === 'admin';
}

/**
 * Check if user is broker
 */
export async function isBroker(): Promise<boolean> {
  const { profile } = await getCurrentUserProfile();
  return profile?.role === 'broker';
}

/**
 * Check if user is customer
 */
export async function isCustomer(): Promise<boolean> {
  const { profile } = await getCurrentUserProfile();
  return profile?.role === 'customer';
}

// ==========================================
// BROKER/AGENT FUNCTIONS
// ==========================================

/**
 * Register as broker
 */
export async function registerAsBroker(agentData: {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  license_number?: string;
  experience_years?: number;
  bio?: string;
  area_specialization?: string[];
}) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    // First update user role to broker
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role: 'broker' })
      .eq('id', user.id);

    if (profileError) throw profileError;

    // Then create agent record
    const { data, error } = await supabase
      .from('agents')
      .insert({
        profile_id: user.id,
        ...agentData,
      })
      .select()
      .single();

    if (error) throw error;
    return { success: true, agent: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Get broker/agent by profile ID
 */
export async function getAgentByProfileId(profileId: string) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return { success: true, agent: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      agent: null 
    };
  }
}

/**
 * Update broker profile
 */
export async function updateAgentProfile(agentId: string, updates: Partial<{
  name: string;
  phone: string;
  whatsapp: string;
  license_number: string;
  experience_years: number;
  bio: string;
  area_specialization: string[];
  profile_image: string;
}>) {
  try {
    const { data, error } = await supabase
      .from('agents')
      .update(updates)
      .eq('id', agentId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, agent: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

// ==========================================
// ADMIN FUNCTIONS
// ==========================================

/**
 * Get all pending broker approvals
 */
export async function getPendingBrokers() {
  try {
    const { data, error } = await supabase
      .from('agents')
      .select(`
        *,
        profiles (
          id,
          email,
          full_name,
          phone,
          avatar_url,
          created_at
        )
      `)
      .eq('status', 'pending');

    if (error) throw error;
    return { success: true, brokers: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      brokers: [] 
    };
  }
}

/**
 * Approve or reject broker
 */
export async function updateBrokerStatus(agentId: string, status: 'approved' | 'rejected') {
  try {
    const { data, error } = await supabase
      .from('agents')
      .update({ status })
      .eq('id', agentId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, agent: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, users: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      users: [] 
    };
  }
}

// ==========================================
// NOTIFICATION FUNCTIONS
// ==========================================

/**
 * Get user notifications
 */
export async function getUserNotifications(limit = 20) {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return { success: true, notifications: data };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      notifications: [] 
    };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message 
    };
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No user found');

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    return { 
      success: false, 
      error: (error as AuthError).message,
      count: 0 
    };
  }
}
