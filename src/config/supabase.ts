import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'];
const supabaseAnonKey = import.meta.env['VITE_SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
} else {
  // Debug logs removed for cleaner console
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

// Export types for better TypeScript support
export type { SupabaseClient } from '@supabase/supabase-js';
export type { Database } from './database.types';

