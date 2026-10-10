import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation checks
function validateConfig() {
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    return 'Missing VITE_SUPABASE_URL in .env';
  }
  if (!supabaseUrl.startsWith('https://') || supabaseUrl.includes('your-project-id')) {
    return 'Invalid VITE_SUPABASE_URL: must be a valid https:// Supabase endpoint';
  }
  if (!supabaseKey || supabaseKey.trim() === '') {
    return 'Missing VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY in .env';
  }
  if (supabaseKey.includes('your-anon-key')) {
    return 'VITE_SUPABASE_PUBLISHABLE_KEY contains placeholder text';
  }
  return null;
}

export const configError = validateConfig();
export const isConfigured = configError === null;

// Instantiate client only when valid, otherwise null to prevent uncaught runtime errors
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function getSupabaseStatus() {
  return {
    isConfigured,
    configError,
    supabaseUrl: supabaseUrl ? (supabaseUrl.length > 25 ? supabaseUrl.slice(0, 25) + '...' : supabaseUrl) : 'Not Set',
    hasKey: Boolean(supabaseKey && supabaseKey.trim() !== ''),
  };
}
