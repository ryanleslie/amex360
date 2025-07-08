
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { UserList } from './UserList';

export function UserListCard() {
  const { users, loading } = useAdminUsers();

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
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">User List</h3>
            <Badge variant="outline">
              {users.length} users
            </Badge>
          </div>
          <Button 
            asChild 
            size="sm"
            className="ml-auto"
          >
            <a 
              href="https://supabase.com/dashboard/project/eympxjimldhplotitshq/auth/users" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Add User
            </a>
          </Button>
        </div>

        <UserList users={users} />
      </div>
    </Card>
  );
}
