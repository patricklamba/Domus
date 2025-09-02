import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';
import { mockSupabase } from './supabase.mock';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Utiliser le mock si les variables d'environnement ne sont pas définies ou si on force le mock
const useMock = !supabaseUrl || !supabaseAnonKey || process.env.EXPO_PUBLIC_USE_MOCK === 'true';

console.log('Using Supabase mock:', useMock);

export const supabase = useMock 
  ? (mockSupabase as any)
  : createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });