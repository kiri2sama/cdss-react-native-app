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
const neonConnectionString = 'postgresql://neondb_owner:npg_DEz6vpA2MOBJ@ep-twilight-breeze-a2dlvdlb-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
export const sql = neon(neonConnectionString);