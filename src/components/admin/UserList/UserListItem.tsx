import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface UserData {
  id: string;
  display_name?: string;
  first_name?: string;
  email?: string;
  created_at?: string;
  last_login?: string;
}

interface UserListItemProps {
  user: UserData;
  index: number;
}

export function UserListItem({ user, index }: UserListItemProps) {
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

  return (
    <div className="p-3 border rounded-lg bg-gradient-to-b from-white to-gray-50 space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium text-sm">
          {user.display_name || user.first_name || user.email || user.id}
        </div>
        <Badge variant="secondary">
          <Shield className="h-3 w-3 mr-1" />
          User
        </Badge>
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        {user.email && <div>Email: {user.email}</div>}
        <div>Last login: {formatLastLogin(user.last_login)}</div>
      </div>
    </div>
  );
}