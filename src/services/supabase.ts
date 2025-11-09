// Note: Auth is handled by Supabase, data by Neon
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { neon } from '@neondatabase/serverless';

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Neon database client
const neonConnectionString = 'YOUR_NEON_CONNECTION_STRING'; // Replace with Neon connection string
export const sql = neon(neonConnectionString);