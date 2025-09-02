import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type CleanerProfile = Database['public']['Tables']['cleaner_profiles']['Row'];

// Mock data pour cleaner
const mockCleanerProfile: Profile = {
  id: 'mock-cleaner-id',
  email: 'cleaner@example.com',
  full_name: 'Maria Cleaner',
  phone_number: '+244912345678',
  role: 'cleaner',
  avatar_url: null,
  location: 'Luanda, Angola',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock data pour employer
const mockEmployerProfile: Profile = {
  id: 'mock-employer-id',
  email: 'employer@example.com',
  full_name: 'John Employer',
  phone_number: '+244912345679',
  role: 'employer',
  avatar_url: null,
  location: 'Luanda, Angola',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Mock data pour cleaner_profiles
const mockCleanerDetails: CleanerProfile = {
  id: 'mock-cleaner-details-id',
  user_id: 'mock-cleaner-id',
  age: 28,
  experience_years: 5,
  hourly_rate: 25,
  bio: 'Professional cleaner with 5 years of experience',
  services: ['house_cleaning', 'deep_cleaning', 'office_cleaning'],
  is_available: true,
  rating: 4.8,
  total_jobs: 47,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// global mock state
let mockSession: any = null;
let mockUser: any = null;
let currentProfile: Profile | null = null;

// Stocker les callbacks pour onAuthStateChange
let authStateCallbacks: Array<(event: string, session: any) => void> = [];

export const mockSupabase = {
  auth: {
    getSession: () => {
      console.log('Mock getSession: return session:', mockSession ? 'OUI' : 'NON');
      return Promise.resolve({ 
        data: { 
          session: mockSession
        }, 
        error: null 
      });
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      console.log('Mock onAuthStateChange: Callback saved');
      // Stocker le callback
      authStateCallbacks.push(callback);
      
      // Return the object with the unsubscribe method
      return { 
        data: {
          subscription: { 
            unsubscribe: () => {
              console.log('Mock onAuthStateChange: Callback deleted');
              // Remove the callback when you unsubscribe
              authStateCallbacks = authStateCallbacks.filter(cb => cb !== callback);
            }
          }
        }
      };
    },
    
    signInWithOtp: async ({ phone }: { phone: string }) => {
      console.log('Mock signInWithOtp called with:', { phone });
      return { error: null };
    },
    
    verifyOtp: async ({ phone, token, type }: { phone: string, token: string, type: string }) => {
      console.log('Mock verifyOtp called with:', { phone, token, type });
      
      // Determine the role based on the last digit of the number
      const lastDigit = parseInt(phone.slice(-1));
      const isCleaner = lastDigit % 2 === 1;
      
      const role = isCleaner ? 'cleaner' : 'employer';
      const profile = isCleaner ? mockCleanerProfile : mockEmployerProfile;
      
      // create complete session
      mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Date.now() + 3600 * 1000,
        token_type: 'bearer',
        user: {
          id: profile.id,
          email: profile.email,
          phone: phone,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      };
      
      mockUser = mockSession.user;
      currentProfile = profile;
      
      console.log(`Mock verifyOtp:connected as ${role} with ID:`, profile.id);
      console.log('Mock verifyOtp: Number of callbacks to trigger:', authStateCallbacks.length);
      
      // Trigger all authentication status callbacks AFTER a small delay
      setTimeout(() => {
        authStateCallbacks.forEach((callback, index) => {
          console.log(`Mock verifyOtp: Callback triggering ${index + 1}/${authStateCallbacks.length}`);
          try {
            callback('SIGNED_IN', mockSession);
          } catch (error) {
            console.error(`Mock verifyOtp: Error in callback ${index + 1}:`, error);
          }
        });
      }, 10);
      
      return { error: null };
    },
    
    signOut: async () => {
      console.log('Mock signOut');
      mockSession = null;
      mockUser = null;
      currentProfile = null;
      
      // Trigger callbacks for disconnection
      authStateCallbacks.forEach(callback => {
        callback('SIGNED_OUT', null);
      });
      
      return { error: null };
    },
    
    get user() {
      return mockUser;
    }
  },
  
  from: (table: string) => {
    console.log('Mock from: Table requested:', table);
    
    if (table === 'profiles') {
      return {
        select: () => ({
          eq: (column: string, value: string) => ({
            single: () => {
              console.log('Mock profiles select: Recherche', column, '=', value);
              console.log('Mock profiles select: currentProfile available:', currentProfile ? 'OUI' : 'NON');
              console.log('Mock profiles select: currentProfile.id:', currentProfile?.id);
              
              // Check if you're looking for the right user
              if (column === 'id' && currentProfile && value === currentProfile.id) {
                console.log('Mock profiles select: Profile found!');
                return Promise.resolve({ 
                  data: currentProfile, 
                  error: null 
                });
              } else {
                console.log('Mock profiles select: Profile not found for ID:', value);
                return Promise.resolve({ 
                  data: null, 
                  error: { code: 'PGRST116', message: 'Profile not found' }
                });
              }
            }
          })
        }),
        upsert: (data: any) => {
          console.log('Mock profiles upsert:', data);
          if (currentProfile) {
            Object.assign(currentProfile, data);
            currentProfile.updated_at = new Date().toISOString();
            console.log('Mock profiles upsert: Profile mis à jour:', currentProfile);
          }
          return Promise.resolve({ data: currentProfile ? [currentProfile] : null, error: null });
        }
      };
    }
    
    if (table === 'cleaner_profiles') {
      return {
        select: () => ({
          eq: (column: string, value: string) => ({
            single: () => {
              console.log('Mock cleaner_profiles select:', column, '=', value);
              return Promise.resolve({ 
                data: currentProfile?.role === 'cleaner' ? mockCleanerDetails : null, 
                error: null 
              });
            }
          })
        }),
        upsert: (data: any) => {
          console.log('Mock cleaner_profiles upsert:', data);
          return Promise.resolve({ data: [mockCleanerDetails], error: null });
        }
      };
    }
    
    console.log('Mock from: Unrecognized table:', table);
    return {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Table not found' } })
        })
      }),
      upsert: () => Promise.resolve({ error: { message: 'Table not found' } })
    };
  }
};