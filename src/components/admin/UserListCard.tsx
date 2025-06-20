
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserData {
  user_id: string;
  display_name?: string;
  first_name?: string;
  last_login?: string;
  role?: string;
}

export function UserListCard() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Get users with their profiles and roles, ordered by last_login descending
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          user_id,
          last_login,
          profiles (
            display_name,
            first_name
          ),
          user_roles (
            role
          )
        `)
        .order('last_login', { ascending: false, nullsFirst: false });

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
      }

      // Transform the data
      const transformedUsers = usersData?.map(user => ({
        user_id: user.user_id,
        display_name: user.profiles?.display_name,
        first_name: user.profiles?.first_name,
        last_login: user.last_login,
        role: user.user_roles?.[0]?.role || 'user'
      })) || [];

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

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return 'Never';
    try {
      return formatDistanceToNow(new Date(lastLogin), { addSuffix: true });
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
                  key={user.user_id}
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
                      {user.display_name || user.first_name || user.user_id}
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role || 'user')}>
                      <Shield className="h-3 w-3 mr-1" />
                      {user.role || 'user'}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    ID: {user.user_id}
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
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
