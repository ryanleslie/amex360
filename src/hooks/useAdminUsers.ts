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
      
      // Fetch profiles first - simple query without joins
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      console.log('Profiles data:', profilesData);

      // If we have profiles, fetch their roles separately
      const transformedUsers = [];
      
      if (profilesData && profilesData.length > 0) {
        for (const profile of profilesData) {
          // Try to get the user's role
          let userRole = 'user'; // default
          
          try {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', profile.id)
              .limit(1)
              .maybeSingle();
              
            if (roleData) {
              userRole = roleData.role;
            }
          } catch (roleError) {
            console.log('Could not fetch role for user:', profile.id);
          }

          transformedUsers.push({
            id: profile.id,
            display_name: profile.display_name,
            first_name: profile.first_name,
            email: profile.email,
            role: userRole,
            created_at: profile.created_at,
            last_login: profile.last_login
          });
        }
      }

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