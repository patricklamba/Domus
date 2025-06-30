export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone_number: string | null
          role: 'employer' | 'cleaner'
          avatar_url: string | null
          location: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone_number?: string | null
          role: 'employer' | 'cleaner'
          avatar_url?: string | null
          location?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone_number?: string | null
          role?: 'employer' | 'cleaner'
          avatar_url?: string | null
          location?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      cleaner_profiles: {
        Row: {
          id: string
          user_id: string | null
          age: number | null
          experience_years: number | null
          hourly_rate: number | null
          bio: string | null
          services: string[] | null
          is_available: boolean | null
          rating: number | null
          total_jobs: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          age?: number | null
          experience_years?: number | null
          hourly_rate?: number | null
          bio?: string | null
          services?: string[] | null
          is_available?: boolean | null
          rating?: number | null
          total_jobs?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          age?: number | null
          experience_years?: number | null
          hourly_rate?: number | null
          bio?: string | null
          services?: string[] | null
          is_available?: boolean | null
          rating?: number | null
          total_jobs?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      job_requests: {
        Row: {
          id: string
          employer_id: string | null
          cleaner_id: string | null
          title: string
          description: string | null
          location: string
          start_date: string
          start_time: string
          duration_days: number
          price_per_day: number
          total_price: number
          status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          employer_id?: string | null
          cleaner_id?: string | null
          title: string
          description?: string | null
          location: string
          start_date: string
          start_time: string
          duration_days: number
          price_per_day: number
          total_price: number
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          employer_id?: string | null
          cleaner_id?: string | null
          title?: string
          description?: string | null
          location?: string
          start_date?: string
          start_time?: string
          duration_days?: number
          price_per_day?: number
          total_price?: number
          status?: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          job_id: string | null
          reviewer_id: string | null
          reviewee_id: string | null
          rating: number
          comment: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          job_id?: string | null
          reviewer_id?: string | null
          reviewee_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          job_id?: string | null
          reviewer_id?: string | null
          reviewee_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'employer' | 'cleaner'
      job_status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}