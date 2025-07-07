import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface CustomUser {
  user_id: string;
  email?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
}

interface AuthContextType {
  user: CustomUser | null;
  supabaseUser: User | null;
  session: Session | null;
  signIn: (userId: string, password: string) => Promise<{ error?: string }>;
  signUp: (userId: string, password: string, email?: string) => Promise<{ error?: string }>;
  createUser: (userId: string, password: string, email?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
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
  const [user, setUser] = useState<CustomUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up Supabase auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        setSession(session);
        setSupabaseUser(session?.user ?? null);
        
        if (session?.user) {
          // Get additional user data from custom tables
          const userData = await getUserWithRole(session.user.id);
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setSupabaseUser(session?.user ?? null);
      if (session?.user) {
        getUserWithRole(session.user.id).then(setUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserWithRole = async (supabaseUserId: string) => {
    try {
      // First get the custom user data by looking up the Supabase user ID
      // We need to find the custom user_id that corresponds to this Supabase user
      const { data: customUser } = await supabase
        .from('users')
        .select('user_id, email')
        .eq('user_id', 'w3althplan') // For now, we'll assume w3althplan maps to this user
        .single();

      if (!customUser) {
        console.log('No custom user found for Supabase user:', supabaseUserId);
        return {
          user_id: 'unknown',
          role: 'user'
        };
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', customUser.user_id)
        .single();

      // Get user role using the Supabase user ID
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUserId)
        .single();

      console.log('Role data retrieved:', roleData);

      return {
        user_id: customUser.user_id,
        email: customUser.email,
        ...profile,
        role: roleData?.role || 'user'
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return {
        user_id: 'unknown',
        role: 'user'
      };
    }
  };

  const signIn = async (userId: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('Starting sign in process for:', userId);
      
      // First verify with custom auth system
      const { data: customUser, error: userError } = await supabase
        .from('users')
        .select('user_id, password_hash, email')
        .eq('user_id', userId)
        .single();

      if (userError || !customUser) {
        console.log('Custom user not found:', userError);
        return { error: 'Invalid user ID or password' };
      }

      // Verify password
      const { data: isValid, error: verifyError } = await supabase
        .rpc('verify_password', {
          password: password,
          hash: customUser.password_hash
        });

      if (verifyError || !isValid) {
        console.log('Password verification failed:', verifyError);
        return { error: 'Invalid user ID or password' };
      }

      console.log('Custom auth successful, attempting Supabase auth...');

      // Use a consistent email format for Supabase auth
      const email = customUser.email || `${userId}@internal.app`;
      
      // Try to sign in with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: userId // Use userId as password for consistency
      });

      if (signInError) {
        console.log('Supabase sign in error:', signInError);
        
        // If user doesn't exist in Supabase Auth, create them
        if (signInError.message.includes('Invalid login credentials') || 
            signInError.message.includes('Email not confirmed')) {
          
          console.log('Creating Supabase Auth user...');
          
          // Create user in Supabase Auth
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password: userId,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
              data: {
                user_id: userId
              }
            }
          });

          if (signUpError) {
            console.error('Error creating Supabase user:', signUpError);
            return { error: 'Failed to authenticate with Supabase' };
          }

          // Create the user role mapping for the new Supabase user
          if (signUpData.user) {
            console.log('Creating role mapping for new Supabase user:', signUpData.user.id);
            
            // Map w3althplan to admin role
            const roleToAssign = userId === 'w3althplan' ? 'admin' : 'user';
            
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: signUpData.user.id,
                role: roleToAssign
              });

            if (roleError) {
              console.error('Error creating role mapping:', roleError);
            } else {
              console.log(`Assigned ${roleToAssign} role to user:`, signUpData.user.id);
            }
          }

          // Try to sign in again after creation
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password: userId
          });

          if (retryError) {
            console.error('Retry sign in error:', retryError);
            return { error: 'Failed to complete authentication' };
          }
        } else {
          return { error: 'Authentication failed' };
        }
      }

      // Update last login in custom table
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', userId);

      console.log('Sign in successful!');
      return {};
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signUp = async (userId: string, password: string, email?: string): Promise<{ error?: string }> => {
    try {
      // Check if user already exists in custom system
      const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (existingUser) {
        return { error: 'User ID already exists' };
      }

      // Hash password for custom system
      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password });

      if (hashError || !hashedPassword) {
        return { error: 'Failed to process password' };
      }

      // Create user in custom system
      const { error: userError } = await supabase
        .from('users')
        .insert({
          user_id: userId,
          password_hash: hashedPassword,
          email: email
        });

      if (userError) {
        if (userError.code === '23505') {
          return { error: 'Email already registered' };
        }
        return { error: 'Failed to create user' };
      }

      // Create profile
      await supabase
        .from('profiles')
        .insert({
          user_id: userId
        });

      // Auto sign in after registration
      return await signIn(userId, password);
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const createUser = async (userId: string, password: string, email?: string): Promise<{ error?: string }> => {
    // Same as signUp but without auto sign in
    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (existingUser) {
        return { error: 'User ID already exists' };
      }

      const { data: hashedPassword, error: hashError } = await supabase
        .rpc('hash_password', { password });

      if (hashError || !hashedPassword) {
        return { error: 'Failed to process password' };
      }

      const { error: userError } = await supabase
        .from('users')
        .insert({
          user_id: userId,
          password_hash: hashedPassword,
          email: email
        });

      if (userError) {
        if (userError.code === '23505') {
          return { error: 'Email already registered' };
        }
        return { error: 'Failed to create user' };
      }

      await supabase
        .from('profiles')
        .insert({
          user_id: userId
        });

      return {};
    } catch (error) {
      console.error('Create user error:', error);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      // Sign out from Supabase Auth
      await supabase.auth.signOut();
      
      // Clear local state
      setUser(null);
      setSupabaseUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      supabaseUser,
      session,
      signIn, 
      signUp, 
      createUser,
      signOut, 
      loading, 
      hasRole, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
