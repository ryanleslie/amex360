import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

interface UserData {
  id: string;
  display_name?: string;
  first_name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  last_login?: string;
}

interface UserListItemProps {
  user: UserData;
  index: number;
  showUsers: boolean;
}

export function UserListItem({ user, index, showUsers }: UserListItemProps) {
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
    <div
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
  );
}