import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initialisation...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthContext: Session initiale récupérée:', session?.user?.id || 'null');
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('AuthContext onAuthStateChange:', event, 'User ID:', session?.user?.id || 'null');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('AuthContext: Utilisateur connecté, récupération du profil...');
          await fetchProfile(session.user.id);
        } else {
          console.log('AuthContext: Utilisateur déconnecté');
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => {
      console.log('AuthContext: Nettoyage subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('AuthContext fetchProfile: Recherche profil pour userId:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('AuthContext fetchProfile: Résultat -', { 
        data: data ? { id: data.id, role: data.role, full_name: data.full_name } : null, 
        error: error?.message || null 
      });

      if (error && error.code !== 'PGRST116') {
        console.error('AuthContext fetchProfile: Erreur:', error);
        setProfile(null);
      } else {
        console.log('AuthContext fetchProfile: Profile défini avec rôle:', data?.role);
        setProfile(data);
      }
    } catch (error) {
      console.error('AuthContext fetchProfile: Exception:', error);
      setProfile(null);
    } finally {
      console.log('AuthContext fetchProfile: Loading terminé');
      setLoading(false);
    }
  };

  const signInWithPhone = async (phone: string) => {
    console.log('AuthContext signInWithPhone:', phone);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    });
    console.log('AuthContext signInWithPhone result:', error ? 'Erreur' : 'Succès');
    return { error };
  };

  const verifyOtp = async (phone: string, otp: string) => {
    console.log('AuthContext verifyOtp:', phone, otp);
    const { error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: 'sms',
    });
    console.log('AuthContext verifyOtp result:', error ? `Erreur: ${error.message}` : 'Succès');
    return { error };
  };

  const signOut = async () => {
    console.log('AuthContext signOut');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthContext signOut: Erreur:', error);
    } else {
      console.log('AuthContext signOut: Succès');
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    console.log('AuthContext updateProfile:', updates);
    if (!user) {
      console.error('AuthContext updateProfile: Pas d\'utilisateur connecté');
      return { error: new Error('No user found') };
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email || '',
        ...updates,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      console.log('AuthContext updateProfile: Succès, récupération du profil mis à jour');
      await fetchProfile(user.id);
    } else {
      console.error('AuthContext updateProfile: Erreur:', error);
    }

    return { error };
  };

  // Log des changements d'état importants
  useEffect(() => {
    console.log('AuthContext STATE UPDATE:', {
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