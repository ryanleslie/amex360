import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  id: string;
  display_name?: string;
  first_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  last_login?: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    // Clear cache on component mount to force fresh data
    sessionStorage.removeItem('admin-users-cache');
    sessionStorage.removeItem('email-sync-completed');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Check if we have cached data for this session
      const cachedData = sessionStorage.getItem('admin-users-cache');
      const syncCompleted = sessionStorage.getItem('email-sync-completed');
      
      if (cachedData) {
        console.log('Loading users from cache...');
        const parsedData = JSON.parse(cachedData);
        setUsers(parsedData);
        setTimeout(() => setShowUsers(true), 100);
        setLoading(false);
        return;
      }

      console.log('Fetching users from database...');
      
      // Only sync emails once per session
      if (!syncCompleted) {
        try {
          console.log('Syncing profile emails...');
          await supabase.functions.invoke('sync-profile-emails');
          sessionStorage.setItem('email-sync-completed', 'true');
        } catch (syncError) {
          console.log('Email sync completed or not needed:', syncError);
        }
      }
      
      // Fetch profiles with their roles from user_roles table
      // Use a left join instead of inner join to include users without roles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          first_name,
          created_at,
          last_login,
          email,
          user_roles(role)
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // If the join fails, try fetching profiles without roles
        const { data: basicProfiles, error: basicError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (basicError) {
          console.error('Error fetching basic profiles:', basicError);
          return;
        }
        
        // Use basic profiles data without roles
        const basicUsers = basicProfiles?.map(profile => ({
          id: profile.id,
          display_name: profile.display_name,
          first_name: profile.first_name,
          email: profile.email,
          role: 'user', // Default role
          created_at: profile.created_at,
          last_login: profile.last_login
        })) || [];
        
        console.log('Using basic profiles:', basicUsers);
        sessionStorage.setItem('admin-users-cache', JSON.stringify(basicUsers));
        setUsers(basicUsers);
        setTimeout(() => setShowUsers(true), 100);
        return;
      }

      console.log('Profiles data:', profilesData);

      // Transform the data and get roles from user_roles table
      const transformedUsers = profilesData?.map((profile: any) => {
        // Get the first role from user_roles (users should typically have one role)
        const userRole = profile.user_roles?.[0]?.role || 'user';
        
        return {
          id: profile.id,
          display_name: profile.display_name,
          first_name: profile.first_name,
          email: profile.email,
          role: userRole,
          created_at: profile.created_at,
          last_login: profile.last_login
        };
      }) || [];

      console.log('Transformed users:', transformedUsers);
      
      // Cache the transformed data for this session
      sessionStorage.setItem('admin-users-cache', JSON.stringify(transformedUsers));
      
      setUsers(transformedUsers);
      
      // Trigger staggered animations after data is loaded
      setTimeout(() => setShowUsers(true), 100);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    showUsers
  };
}