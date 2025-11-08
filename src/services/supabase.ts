import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/database'; // We'll define this later

const supabaseUrl = 'YOUR_SUPABASE_URL'; // Replace with actual URL
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Replace with actual key

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});