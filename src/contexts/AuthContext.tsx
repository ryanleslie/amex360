
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { invalidateAdminUsersCache } from '@/hooks/useAdminUsers';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
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
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Check admin role when user signs in or session changes
        if (currentSession?.user) {
          checkAdminRole(currentSession.user);
          // Invalidate admin users cache on login to ensure fresh data
          if (event === 'SIGNED_IN') {
            invalidateAdminUsersCache();
          }
        } else {
          setIsAdmin(false);
        }
        
        // Track login when user signs in (do this after setting auth state)
        if (event === 'SIGNED_IN' && currentSession?.user) {
          // Don't await this - let it run in background to avoid blocking auth flow
          supabase.functions.invoke('update-last-login', {
            headers: {
              Authorization: `Bearer ${currentSession.access_token}`,
            },
          }).catch(error => {
            console.error('Failed to update last login:', error);
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      setLoading(false);
      
      if (existingSession?.user) {
        checkAdminRole(existingSession.user);
      }
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
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Check admin role and update state
  const checkAdminRole = async (currentUser: User) => {
    try {
      // Always fetch fresh data from database to ensure current permissions
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();
      
      if (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
        return;
      }
      
      const isAdminRole = data?.role === 'admin';
      console.log(`User ${currentUser.email} role check: ${data?.role} (isAdmin: ${isAdminRole})`);
      setIsAdmin(isAdminRole);
    } catch (error) {
      console.error('Error checking admin role:', error);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      signIn, 
      signOut, 
      loading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
