
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface UserData {
  id: string;
  display_name?: string;
  first_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  last_login?: string;
}

export function UserListCard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false);

  // We'll get roles from the user_roles table instead of hard-coded emails

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
      
      // Fetch profiles with their roles from user_roles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          display_name,
          first_name,
          created_at,
          last_login,
          email,
          user_roles!inner(role)
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatCreatedAt = (createdAt: string | null) => {
    if (!createdAt) return 'Unknown';
    try {
      return new Date(createdAt).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Never';
    try {
      const loginDate = new Date(lastLogin);
      const now = new Date();
      const diffMs = now.getTime() - loginDate.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays} days ago`;
      } else {
        return loginDate.toLocaleDateString();
      }
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">User List</h3>
          <div className="text-center text-muted-foreground animate-pulse">Loading users...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-b from-white to-gray-100">
      <div className="space-y-4">
        <div className="flex items-center gap-2 animate-fade-in">
          <h3 className="text-lg font-semibold">User List</h3>
          <Badge variant="outline" className="ml-auto">
            {users.length} users
          </Badge>
        </div>

        <ScrollArea className="h-[560px]">
          <div className="space-y-3 pr-4">
            {users.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 animate-fade-in">
                No users found
              </div>
            ) : (
              users.map((user, index) => (
                <div
                  key={user.id}
                  className={`p-3 border rounded-lg bg-gradient-to-b from-white to-gray-50 space-y-2 transition-all duration-500 ${
                    showUsers 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">
                      {user.display_name || user.first_name || user.id}
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role || 'user')}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role || 'user'}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Last login: {formatLastLogin(user.last_login)}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
