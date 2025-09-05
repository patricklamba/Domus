// contexts/AuthContext.tsx - Modified version for Zelare API
import React, { createContext, useContext, useEffect, useState } from 'react';
import { zelareApi, UserResponse } from '@/lib/api'

// Adapt types to match your existing interface
interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: 'employer' | 'cleaner'; // Conversion from EMPLOYER/CLEANER
  avatar_url: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  session: any | null; // Compatibility with old code
  user: any | null;    // Compatibility with old code
  profile: Profile | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext Zelare: Initialization...');
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const isAuth = await zelareApi.isAuthenticated();
      
      if (isAuth) {
        const response = await zelareApi.getCurrentUser();
        if (response.success) {
          const userData = response.data;
          setUserFromResponse(userData);
        } else {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const setUserFromResponse = (userData: UserResponse) => {
    // Create a session object compatible with old code
    const mockSession = {
      access_token: 'zelare-token',
      user: {
        id: userData.id,
        email: userData.email || '',
        phone: userData.phoneNumber,
      }
    };

    // Convert UserResponse to Profile for compatibility
    const profileData: Profile = {
      id: userData.id,
      email: userData.email || '',
      full_name: userData.fullName,
      phone_number: userData.phoneNumber,
      role: userData.role.toLowerCase() as 'employer' | 'cleaner',
      avatar_url: userData.avatarUrl || null,
      location: userData.location || null,
      created_at: userData.createdAt,
      updated_at: userData.updatedAt,
    };

    setSession(mockSession);
    setUser(mockSession.user);
    setProfile(profileData);

    console.log('AuthContext Zelare: User connected:', {
      id: userData.id,
      role: profileData.role,
      name: userData.fullName
    });
  };

  const clearAuth = () => {
    setSession(null);
    setUser(null);
    setProfile(null);
  };

  const signInWithPhone = async (phone: string) => {
    console.log('AuthContext Zelare signInWithPhone:', phone);
    try {
      const response = await zelareApi.sendOtp(phone);
      if (response.success) {
        console.log('AuthContext Zelare: OTP sent successfully');
        return { error: null };
      } else {
        console.error('AuthContext Zelare: OTP sending error:', response.message);
        return { error: new Error(response.message) };
      }
    } catch (error: any) {
      console.error('AuthContext Zelare signInWithPhone error:', error);
      return { error };
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    console.log('AuthContext Zelare verifyOtp:', phone, otp);
    try {
      const response = await zelareApi.verifyOtp(phone, otp);
      if (response.success) {
        setUserFromResponse(response.data.user);
        console.log('AuthContext Zelare: Login successful');
        return { error: null };
      } else {
        console.error('AuthContext Zelare: OTP verification error:', response.message);
        return { error: new Error(response.message) };
      }
    } catch (error: any) {
      console.error('AuthContext Zelare verifyOtp error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthContext Zelare signOut');
    try {
      await zelareApi.logout();
    } catch (error) {
      console.error('AuthContext Zelare signOut error:', error);
    } finally {
      clearAuth();
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    console.log('AuthContext Zelare updateProfile:', updates);
    try {
      // Adapt fields for Zelare API
      // Adapt fields for Zelare API, filtering out null values
const apiUpdates: {
  fullName?: string;
  email?: string;
  location?: string;
  avatarUrl?: string;
} = {};

if (updates.full_name !== undefined) {
  apiUpdates.fullName = updates.full_name;
}
if (updates.email !== undefined) {
  apiUpdates.email = updates.email;
}
if (updates.location !== undefined && updates.location !== null) {
  apiUpdates.location = updates.location;
}
if (updates.avatar_url !== undefined && updates.avatar_url !== null) {
  apiUpdates.avatarUrl = updates.avatar_url;
}

      const response = await zelareApi.updateProfile(apiUpdates);
      if (response.success) {
        setUserFromResponse(response.data);
        console.log('AuthContext Zelare: Profile updated');
        return { error: null };
      } else {
        console.error('AuthContext Zelare: Profile update error:', response.message);
        return { error: new Error(response.message) };
      }
    } catch (error: any) {
      console.error('AuthContext Zelare updateProfile error:', error);
      return { error };
    }
  };

  // Log state changes
  useEffect(() => {
    console.log('AuthContext Zelare STATE:', {
      hasSession: !!session,
      hasUser: !!user,
      hasProfile: !!profile,
      profileRole: profile?.role || 'null',
      loading
    });
  }, [session, user, profile, loading]);

  const value = {
    session,
    user,
    profile,
    loading,
    signInWithPhone,
    verifyOtp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}