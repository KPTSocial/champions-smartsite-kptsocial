
import { createClient } from '@supabase/supabase-js'

// These environment variables are managed by Lovable's Supabase integration.
// Make sure you have connected your Supabase project in the Lovable editor.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables not found. Make sure the Supabase integration is configured correctly in Lovable.");
}

// The use of `!` is to assert that the variables are non-null.
// If they are not set, `createClient` will be called with undefined,
// and subsequent Supabase calls will fail, which is handled in the UI.
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
