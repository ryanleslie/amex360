
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export function UserCreationForm() {
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);

  // Trigger animation after component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className={`p-6 bg-gradient-to-b from-white to-gray-100 transition-all duration-500 ${
      showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">Manage user accounts and roles</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Creating New Users</h4>
            <p className="text-sm text-blue-800 mb-3">
              For this app, with Supabase authentication, users must be created using in Supabase by request. 
              As an admin, roles can then be assigned to registered users in the profiles table.
            </p>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
              Manual Registration Required
            </Badge>
          </div>

          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Admin Instructions</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Check for new credential requests via discord direct message</li>
              <li>Provision the new account with email and unique password</li>
              <li>Once registered, view and manage their roles in the user list</li>
              <li>Update user roles as needed using the user management interface</li>
            </ol>
          </div>

          <Button 
            asChild 
            className="w-full"
          >
            <a 
              href="https://supabase.com/dashboard/project/eympxjimldhplotitshq/auth/users" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Create New User
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
