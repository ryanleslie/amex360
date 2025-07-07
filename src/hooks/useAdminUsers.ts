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

// Session-based cache to store users data
let cachedUsers: UserData[] | null = null;
let cacheLoading = false;

export function useAdminUsers() {
  const [users, setUsers] = useState<UserData[]>(cachedUsers || []);
  const [loading, setLoading] = useState(!cachedUsers);

  useEffect(() => {
    // If we already have cached data, use it
    if (cachedUsers) {
      setUsers(cachedUsers);
      setLoading(false);
      return;
    }

    // If already loading, don't start another request
    if (cacheLoading) {
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    cacheLoading = true;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      const userData = data || [];
      // Cache the data for the session
      cachedUsers = userData;
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      cacheLoading = false;
    }
  };

  return {
    users,
    loading
  };
}