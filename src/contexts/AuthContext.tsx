
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string, userEmail: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      // Get user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      console.log('Profile data:', profileData);

      // Get user role - using maybeSingle to avoid errors if no role exists
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (roleError && roleError.code !== 'PGRST116') {
        console.error('Error fetching role:', roleError);
      }

      console.log('Role data:', roleData);

      // Set profile with role, even if profile doesn't exist in profiles table
      const userProfile: UserProfile = {
        id: userId,
        email: userEmail,
        ...profileData,
        role: roleData?.role || 'user'
      };

      console.log('Setting profile:', userProfile);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Set basic profile even if there's an error
      setProfile({
        id: userId,
        email: userEmail,
        role: 'user'
      });
    }
  };

  const refreshProfile = async () => {
    if (user?.id && user?.email) {
      console.log('Manually refreshing profile...');
      await fetchUserProfile(user.id, user.email);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Fetch user profile and role after auth state changes
          if (currentSession.user?.id && currentSession.user?.email) {
            await fetchUserProfile(currentSession.user.id, currentSession.user.email);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user?.id && existingSession?.user?.email) {
        await fetchUserProfile(existingSession.user.id, existingSession.user.email);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const hasRole = (role: string): boolean => {
    console.log('Checking role:', role, 'Current profile role:', profile?.role);
    return profile?.role === role;
  };

  const isAdmin = (): boolean => {
    const adminStatus = hasRole('admin');
    console.log('Is admin check:', adminStatus, 'Profile:', profile);
    return adminStatus;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      profile,
      signIn, 
      signOut, 
      loading, 
      hasRole, 
      isAdmin,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
