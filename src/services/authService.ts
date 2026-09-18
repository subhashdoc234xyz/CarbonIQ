import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile } from '../types';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isAuthConfigured = Boolean(url && anonKey);
export const supabase: SupabaseClient | null = isAuthConfigured
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;

export const toUserProfile = (user: { id: string; email?: string; user_metadata?: Record<string, unknown> }): UserProfile => {
  const metadata = user.user_metadata || {};
  const name = String(metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Workspace user');
  return {
    id: user.id,
    fullName: name,
    email: user.email || '',
    avatarUrl: String(metadata.avatar_url || metadata.picture || ''),
    facility: 'Your facility',
    role: 'Member',
  };
};

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Google sign-in is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then enable Google in Supabase Authentication.');
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  if (error) throw error;
}
