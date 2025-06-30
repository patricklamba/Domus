import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Secure storage adapter for Expo
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      // Fallback to localStorage for web
      return Promise.resolve(localStorage.getItem(key));
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      // Fallback to localStorage for web
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      // Fallback to localStorage for web
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone_number: string | null;
          role: 'employer' | 'cleaner';
          avatar_url: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone_number?: string | null;
          role: 'employer' | 'cleaner';
          avatar_url?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone_number?: string | null;
          role?: 'employer' | 'cleaner';
          avatar_url?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cleaner_profiles: {
        Row: {
          id: string;
          user_id: string;
          age: number | null;
          experience_years: number | null;
          hourly_rate: number | null;
          bio: string | null;
          services: string[] | null;
          is_available: boolean;
          rating: number | null;
          total_jobs: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age?: number | null;
          experience_years?: number | null;
          hourly_rate?: number | null;
          bio?: string | null;
          services?: string[] | null;
          is_available?: boolean;
          rating?: number | null;
          total_jobs?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          age?: number | null;
          experience_years?: number | null;
          hourly_rate?: number | null;
          bio?: string | null;
          services?: string[] | null;
          is_available?: boolean;
          rating?: number | null;
          total_jobs?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_requests: {
        Row: {
          id: string;
          employer_id: string;
          cleaner_id: string | null;
          title: string;
          description: string | null;
          location: string;
          start_date: string;
          start_time: string;
          duration_days: number;
          price_per_day: number;
          total_price: number;
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employer_id: string;
          cleaner_id?: string | null;
          title: string;
          description?: string | null;
          location: string;
          start_date: string;
          start_time: string;
          duration_days: number;
          price_per_day: number;
          total_price: number;
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employer_id?: string;
          cleaner_id?: string | null;
          title?: string;
          description?: string | null;
          location?: string;
          start_date?: string;
          start_time?: string;
          duration_days?: number;
          price_per_day?: number;
          total_price?: number;
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          job_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
    };
  };
}